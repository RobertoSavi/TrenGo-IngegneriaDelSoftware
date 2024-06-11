import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.mjs';
import validators from "../validators/proposteValidators.mjs";
import Utente from '../models/utenteModel.mjs';
import Proposta from '../models/propostaModel.mjs';
import Valutazione from '../models/valutazioneModel.mjs';
import Notifica from '../models/notificaModel.mjs';
import Chat from '../models/chatModel.mjs';
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

    const grandeOrganizzatore = {
        _id: '123456',
        nome: 'grande',
        cognome: 'organizzatore',
        email: 'grande.organizzatore@testing.com',
        password: 'organizzatorePassword1@',
        username: 'grandeOrganizzatore',
        karma: 10,
        tipoUtente: 'grandeOrganizzatore',
        googleId: null,
        following: [],
        followers: ['follower1', 'follower2'],
        interessi: ['Altro'],
    };

    const newProposta = {
        titolo: 'Proposta di utenteTest',
        categorie: ['Sport'],
        nomeLuogo: 'Park',
        coordinate: { lat: 45.0, lon: 9.0 },
        descrizione: 'Descrizione della proposta',
        numeroPartecipantiDesiderato: 10,
        data: new Date(new Date().setDate(new Date().getDate() + 1)).toDateString(),

    };
    const propostaByLoggedUser = {
        _id: '678910',
        ...newProposta,
        usernameCreatore: 'utenteTest',
        partecipanti: ['utenteTest2'],
        valutabile: true
    };

    const propostaByOtherUser = {
        _id: '678910',
        titolo: 'Proposta di utenteTest2',
        descrizione: 'Descrizione della proposta',
        data: new Date(new Date().setDate(new Date().getDate() + 1)).toDateString(),
        nomeLuogo: 'Park',
        coordinate: { lat: 45.0, lon: 9.0 },
        usernameCreatore: 'utenteTest2',
        partecipanti: ['utenteTest', 'anotherUser'],
        categorie: ['Sport'],
        numeroPartecipantiDesiderato: 10,
        valutabile: true,
    };

    const propostaByGrandeOrganizzatore = {
        _id: '098765',
        titolo: 'Proposta di grandeOrganizzatore',
        descrizione: 'Descrizione della proposta',
        data: new Date(new Date().setDate(new Date().getDate() + 1)).toDateString(),
        nomeLuogo: 'Park',
        coordinate: { lat: 45.0, lon: 9.0 },
        usernameCreatore: 'grandeOrganizzatore',
        categorie: ['Sport'],
        numeroPartecipantiDesiderato: 10,
        partecipanti: [],
    };

    const token = 'sampleToken';

    describe('GET /apiv2/proposte', () => {

        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(Proposta, 'find');
            jest.spyOn(Utente, 'find');
        });

        test('Dovrebbe restituire proposte pubblicate dall\'utente loggato', async () => {
            Proposta.find.mockResolvedValue([propostaByLoggedUser]);

            const response = await request(app)
                .get('/apiv2/proposte')
                .set('Token', token)
                .query({ mie: 'true' });

            expect(response.status).toBe(200);
            expect(response.body.proposte).toEqual([propostaByLoggedUser]);
        });

        test('Dovrebbe restituire proposte a cui l\'utente loggato è iscritto', async () => {
            Proposta.find.mockResolvedValue([propostaByLoggedUser]);

            const response = await request(app)
                .get('/apiv2/proposte')
                .set('Token', token)
                .query({ iscritto: 'true' });

            expect(response.status).toBe(200);
            expect(response.body.proposte).toEqual([propostaByLoggedUser]);
        });

        test('Dovrebbe restituire proposte terminate create o partecipate dall\'utente loggato', async () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            propostaByLoggedUser.data = yesterday.toDateString();

            Proposta.find.mockResolvedValue([propostaByLoggedUser]);

            const response = await request(app)
                .get('/apiv2/proposte')
                .set('Token', token)
                .query({ terminate: 'true' });

            expect(response.status).toBe(200);
            expect(response.body.proposte).toEqual([propostaByLoggedUser]);
        });

        test('Dovrebbe restituire 200 con array vuoto se nessuna proposta è trovata', async () => {
            Proposta.find.mockResolvedValue([]);

            const response = await request(app)
                .get('/apiv2/proposte')
                .set('Token', token);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ "proposte": [] });
        });

        test('Dovrebbe restituire proposte di grandi organizzatori se l\'utente non è loggato', async () => {
            Utente.find.mockResolvedValue([grandeOrganizzatore]);
            Proposta.find.mockResolvedValue([propostaByGrandeOrganizzatore]);

            const response = await request(app)
                .get('/apiv2/proposte');

            expect(response.status).toBe(200);
            expect(response.body.proposte).toEqual([propostaByGrandeOrganizzatore]);
        });

        test('Dovrebbe restituire errore del server durante il recupero delle proposte', async () => {
            Proposta.find.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get('/apiv2/proposte')
                .set('Token', token);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante il recupero delle proposte",
                error: 'Database error',
            });
        });


    });

    describe('GET /apiv2/proposte/:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(Proposta, 'findById');
            jest.spyOn(Valutazione, 'findOne');
            jest.spyOn(Utente, 'findOne');
        });

        test('Dovrebbe restituire la proposta se trovata', async () => {
            Proposta.findById.mockResolvedValue(propostaByLoggedUser);

            const response = await request(app)
                .get(`/apiv2/proposte/${propostaByLoggedUser._id}`)
                .set('Token', token);

            expect(response.status).toBe(200);
            expect(response.body.proposta).toEqual(propostaByLoggedUser);
        });

        test('Dovrebbe restituire 400 se la proposta non è trovata', async () => {
            Proposta.findById.mockResolvedValue(null);

            const response = await request(app)
                .get(`/apiv2/proposte/${propostaByLoggedUser._id}`)
                .set('Token', token);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Proposta non trovata" });
        });

        test('Dovrebbe restituire proposta con valutazioni se richieste e l\'utente è il creatore', async () => {
            Proposta.findById.mockResolvedValue(propostaByLoggedUser);
            Valutazione.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get(`/apiv2/proposte/${propostaByLoggedUser._id}`)
                .set('Token', token)
                .query({ valutazioni: 'true' });

            expect(response.status).toBe(200);
            expect(response.body.proposta.utentiValutabili).toBe(1);
            expect(response.body.proposta.partecipanti).toEqual([['utenteTest2', false]]);
        });

        test('Dovrebbe restituire proposta con valutazioni se richieste e l\'utente non è il creatore ma partecipa alla proposta', async () => {
            Proposta.findById.mockResolvedValue(propostaByOtherUser);
            Valutazione.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get(`/apiv2/proposte/${propostaByOtherUser._id}`)
                .set('Token', token)
                .query({ valutazioni: 'true' });

            expect(response.status).toBe(200);
            expect(response.body.proposta.utentiValutabili).toBe(2);
            expect(response.body.proposta.partecipanti).toEqual([['anotherUser', false], ['utenteTest2', false]]);
        });

        test('Dovrebbe restituire proposta se il creatore è un grande organizzatore e l\'utente non è loggato', async () => {
            propostaByLoggedUser.usernameCreatore = grandeOrganizzatore.username;
            Proposta.findById.mockResolvedValue(propostaByLoggedUser);
            Utente.findOne.mockResolvedValue(grandeOrganizzatore);

            const response = await request(app)
                .get(`/apiv2/proposte/${propostaByLoggedUser._id}`);

            expect(response.status).toBe(200);
            expect(response.body.proposta).toEqual(propostaByLoggedUser);
        });

        test('Dovrebbe restituire 401 se il creatore non è un grande organizzatore e l\'utente non è loggato', async () => {
            Proposta.findById.mockResolvedValue(propostaByLoggedUser);
            Utente.findOne.mockResolvedValue(loggedUser);

            const response = await request(app)
                .get(`/apiv2/proposte/${propostaByLoggedUser._id}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: "Non sei autorizzato a visualizzare questa proposta" });
        });

        test('Dovrebbe restituire errore del server durante il recupero della proposta', async () => {
            Proposta.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/apiv2/proposte/${propostaByLoggedUser._id}`)
                .set('Token', token);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante il recupero della proposta",
                error: 'Database error',
            });
        });
    });

    describe('POST /apiv2/proposte', () => {

        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(Utente, 'findOne').mockResolvedValue(loggedUser);
            jest.spyOn(validators, 'categorieInEnum').mockReturnValue(true);
            jest.spyOn(validators, 'validateTitolo').mockReturnValue(true);
            jest.spyOn(validators, 'validateCoordinate').mockReturnValue(true);
            jest.spyOn(validators, 'validateDescrizione').mockReturnValue(true);
            jest.spyOn(validators, 'validateData').mockReturnValue(true);
            jest.spyOn(Proposta, 'create');
            jest.spyOn(Chat, 'create');
            jest.spyOn(Proposta, 'findByIdAndUpdate');
            jest.spyOn(Notifica, 'create');
        });

        test('Dovrebbe restituire 401 se l\'utente non è loggato', async () => {
            const response = await request(app)
                .post('/apiv2/proposte')
                .send(propostaByLoggedUser);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Nessun token fornito.',
            });
        });

        test('Dovrebbe restituire 400 per categorie non valide', async () => {
            validators.categorieInEnum.mockReturnValue(false);

            const response = await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(propostaByLoggedUser);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'categorie', message: 'Categorie non valide' }],
            });
        });

        test('Dovrebbe restituire 400 per titolo non valido', async () => {
            validators.categorieInEnum.mockReturnValue(true);
            validators.validateTitolo.mockReturnValue(false);

            const response = await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(propostaByLoggedUser);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'titolo', message: 'Titolo troppo lungo o troppo corto' }],
            });
        });

        test('Dovrebbe restituire 400 per coordinate non valide', async () => {
            validators.categorieInEnum.mockReturnValue(true);
            validators.validateTitolo.mockReturnValue(true);
            validators.validateCoordinate.mockReturnValue(false);

            const response = await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(propostaByLoggedUser);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'coordinate', message: 'Latitudine o longitudine non valide' }],
            });
        });

        test('Dovrebbe restituire 400 per descrizione non valida', async () => {
            validators.categorieInEnum.mockReturnValue(true);
            validators.validateTitolo.mockReturnValue(true);
            validators.validateCoordinate.mockReturnValue(true);
            validators.validateDescrizione.mockReturnValue(false);

            const response = await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(propostaByLoggedUser);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'descrizione', message: 'Descrizione troppo lunga' }],
            });
        });

        test('Dovrebbe restituire 400 per data non valida', async () => {
            validators.categorieInEnum.mockReturnValue(true);
            validators.validateTitolo.mockReturnValue(true);
            validators.validateCoordinate.mockReturnValue(true);
            validators.validateDescrizione.mockReturnValue(true);
            validators.validateData.mockReturnValue(false);

            const response = await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(propostaByLoggedUser);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: 'error',
                errors: [{ field: 'data', message: 'Data non valida' }],
            });
        });

        test('Dovrebbe creare una nuova proposta se i dati sono validi', async () => {
            validators.categorieInEnum.mockReturnValue(true);
            validators.validateTitolo.mockReturnValue(true);
            validators.validateCoordinate.mockReturnValue(true);
            validators.validateDescrizione.mockReturnValue(true);
            validators.validateData.mockReturnValue(true);
            Proposta.create.mockResolvedValue({ ...newProposta, _id: '12345' });
            Proposta.findByIdAndUpdate.mockResolvedValue({ ...propostaByLoggedUser, _id: '12345' });
            Chat.create.mockResolvedValue({ _id: 'chat123', partecipanti: [loggedUser.username], idProposta: '12345', messaggi: [] });

            const response = await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(newProposta);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ self: "proposte/12345" });
            expect(Proposta.create).toHaveBeenCalledWith(expect.objectContaining({ ...newProposta, usernameCreatore: loggedUser.username }));
            expect(Chat.create).toHaveBeenCalledWith(expect.objectContaining({ partecipanti: [loggedUser.username], idProposta: '12345', messaggi: [] }));
            expect(Proposta.findByIdAndUpdate).toHaveBeenCalledWith('12345', { idChat: 'chat123' });
        });

        test('Dovrebbe creare notifiche per i followers', async () => {
            validators.categorieInEnum.mockReturnValue(true);
            validators.validateTitolo.mockReturnValue(true);
            validators.validateCoordinate.mockReturnValue(true);
            validators.validateDescrizione.mockReturnValue(true);
            validators.validateData.mockReturnValue(true);

            const proposta = {
                ...propostaByLoggedUser,
                _id: '12345',
                usernameCreatore: loggedUser.username,
            };

            Proposta.create.mockResolvedValue(proposta);
            Chat.create.mockResolvedValue({ _id: 'chat123', partecipanti: [loggedUser.username], idProposta: '12345', messaggi: [] });

            await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(newProposta);

            expect(Notifica.create).toHaveBeenCalledTimes(loggedUser.followers.length);
            loggedUser.followers.forEach(follower => {
                expect(Notifica.create).toHaveBeenCalledWith({
                    sorgente: 'System',
                    username: follower,
                    messaggio: `L'utente ${loggedUser.username} ha pubblicato una nuova proposta: ${newProposta.titolo}`,
                    link: `proposte/12345`,
                    tipo: tipoNotificaEnum.PROPOSTA,
                });
            });
        });

        test('Dovrebbe restituire errore del server durante la creazione della proposta', async () => {
            validators.categorieInEnum.mockReturnValue(true);
            validators.validateTitolo.mockReturnValue(true);
            validators.validateCoordinate.mockReturnValue(true);
            validators.validateDescrizione.mockReturnValue(true);
            validators.validateData.mockReturnValue(true);
            Proposta.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/apiv2/proposte')
                .set('Token', token)
                .send(propostaByLoggedUser);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante la creazione della proposta",
                error: 'Database error',
            });
        });
    });
});

