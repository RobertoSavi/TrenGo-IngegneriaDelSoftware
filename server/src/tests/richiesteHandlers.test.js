import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.mjs';
import validators from "../validators/richiesteValidators.mjs";
import Utente from '../models/utenteModel.mjs';
import Proposta from '../models/propostaModel.mjs';
import Notifica from '../models/notificaModel.mjs';
import Richiesta from '../models/richiestaModel.mjs';
import { tipoNotificaEnum } from '../models/enums.mjs';
import tokenChecker from '../middlewares/tokenChecker.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

describe('proposteHandlers', () => {

    // Set up test users
    const loggedUser = {
        _id: '012345',
        nome: 'utente',
        cognome: 'test',
        email: 'utente.test@testing.com',
        password: 'utentePassword1@',
        username: 'utenteTest',
        karma: 0,
        tipoUtente: 'autenticato',
        googleId: null,
        following: [],
        followers: ['utenteTest2'],
        interessi: ['Altro'],
    };

    const token = 'sampleToken';

    describe('POST /api/proposte/:idProposta/richieste', () => {

        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(Utente, 'findOne').mockResolvedValue(loggedUser);
            jest.spyOn(Proposta, 'findById');
            jest.spyOn(Richiesta, 'create');
            jest.spyOn(Notifica, 'create');
        });

        const idProposta = '60b8d295f8d2f80015b9f2b0';
        const newRichiesta = { usernameRichiedente: 'usernameRichiedente' };

        test('Dovrebbe restituire 401 se l\'utente non è loggato', async () => {
            const response = await request(app)
                .post(`/api/proposte/${idProposta}/richieste`)
                .send(newRichiesta);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Nessun token fornito.',
            });
        });

        test('Dovrebbe restituire 404 se la proposta non esiste', async () => {
            Proposta.findById.mockResolvedValue(null);

            const response = await request(app)
                .post(`/api/proposte/${idProposta}/richieste`)
                .set('Token', token)
                .send(newRichiesta);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Proposta non trovata" });
        });

        test('Dovrebbe restituire 403 se l\'utente tenta di richiedere di partecipare alla propria proposta', async () => {
            const proposta = {
                _id: idProposta,
                titolo: 'Proposta Test',
                usernameCreatore: loggedUser.username
            };
            Proposta.findById.mockResolvedValue(proposta);

            const response = await request(app)
                .post(`/api/proposte/${idProposta}/richieste`)
                .set('Token', token)
                .send(newRichiesta);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: "Impossibile richiedere di partecipare alle proprie proposte" });
        });

        test('Dovrebbe creare una richiesta e inviare una notifica se i dati sono validi', async () => {
            const proposta = {
                _id: idProposta,
                titolo: 'Proposta Test',
                usernameCreatore: 'altroUsername'
            };
            Proposta.findById.mockResolvedValue(proposta);
            Richiesta.create.mockResolvedValue({ ...newRichiesta, _id: '12345', idProposta, titoloProposta: proposta.titolo });
            Notifica.create.mockResolvedValue({
                sorgente: 'System',
                username: proposta.usernameCreatore,
                messaggio: `L'utente ${loggedUser.username} ha richiesto di partecipare alla proposta: ${proposta.titolo}`,
                link: `proposte/${idProposta}`,
                tipo: tipoNotificaEnum.PROPOSTA
            });

            const response = await request(app)
                .post(`/api/proposte/${idProposta}/richieste`)
                .set('Token', token)
                .send(newRichiesta);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ self: "richieste/12345" });
            expect(Richiesta.create).toHaveBeenCalledWith(expect.objectContaining({ usernameRichiedente: 'usernameRichiedente', idProposta, titoloProposta: proposta.titolo }));
            expect(Notifica.create).toHaveBeenCalledWith(expect.objectContaining({
                sorgente: 'System',
                username: proposta.usernameCreatore,
                messaggio: `L'utente ${loggedUser.username} ha richiesto di partecipare alla proposta: ${proposta.titolo}`,
                link: `proposte/${idProposta}`,
                tipo: tipoNotificaEnum.PROPOSTA
            }));
        });

        test('Dovrebbe restituire errore del server durante la creazione della richiesta', async () => {
            const proposta = {
                _id: idProposta,
                titolo: 'Proposta Test',
                usernameCreatore: 'altroUsername'
            };
            Proposta.findById.mockResolvedValue(proposta);
            Richiesta.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post(`/api/proposte/${idProposta}/richieste`)
                .set('Token', token)
                .send(newRichiesta);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante la creazione della richiesta",
                error: 'Database error',
            });
        });
    });
});