/*jest.mock('../middlewares/tokenChecker.mjs', () => ({
    _esModule: true,
    tokenChecker: jest.fn().mockImplementation((req, res, next) => {

        req.utenteLoggato = {
            loggedId: '012345',
            loggedUsername: 'utenteTest'
        };
        next();
    })
}));*/

import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.mjs';
import validators from "../validators/utentiValidators.mjs";
import Utente from '../models/utenteModel.mjs';
import tokenChecker from '../middlewares/tokenChecker.mjs';
import { sendResetPasswordMail } from '../services/emailService.mjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();




describe('utentiHandlers', () => {

    jest.spyOn(validators, 'isUsernameValid').mockReturnValue(true);
    jest.spyOn(validators, 'isEmailValid').mockReturnValue(true);
    jest.spyOn(validators, 'isPasswordValid').mockReturnValue(true);
    jest.spyOn(validators, 'isUsernameTaken').mockResolvedValue(false);
    jest.spyOn(validators, 'isEmailTaken').mockResolvedValue(false);
    jest.spyOn(validators, 'verifyPasswordByUsername').mockResolvedValue(true);
    jest.spyOn(validators, 'getUtente').mockResolvedValue(null);

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
        followers: [],
        interessi: ['Altro'],
    };

    const updatedUser = {
        _id: '012345',
        nome: 'updatedUtente',
        cognome: 'test',
        email: 'utente.test@testing.com',
        password: 'utentePassword1@',
        username: 'utenteTest',
        karma: 0,
        tipoUtente: 'autenticato',
        googleId: null,
        following: [],
        followers: [],
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
        followers: [],
        interessi: ['Altro'],
    };

    const otherUser = {
        _id: '543210',
        nome: 'utente2',
        cognome: 'test2',
        email: 'utente2.test@testing.com',
        password: 'utentePassword2@',
        username: 'utenteTest2',
        karma: 1,
        tipoUtente: 'autenticato',
        googleId: null,
        following: [],
        followers: [],
        interessi: ['Sport'],
    };

    const token = 'sampleToken';

    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks
    });

    describe('POST /api/utenti/signup', () => {
        jest.spyOn(Utente, 'create').mockResolvedValue({
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
            followers: [],
            interessi: ['Altro'],
        });
        test('Dovrebbe registrare un nuovo utente con successo', async () => {
            const response = await request(app).post('/api/utenti/signup').send({
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                password: 'utentePassword1@',
                username: 'utenteTest',
            });
            expect(Utente.create).toHaveBeenCalledWith({
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                password: 'utentePassword1@',
                username: 'utenteTest',
                interessi: ['Altro']
            });
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ "self": "utenti/012345", });
        });

        test('Dovrebbe restituire errore per username non valido', async () => {
            validators.isUsernameValid.mockReturnValue(false);

            const response = await request(app).post('/api/utenti/signup').send({
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                password: 'utentePassword1@',
                username: 'invalidUsername',
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "error",
                errors: [{ field: 'username', message: 'Username non valido' }],
            });
        });

        test('Dovrebbe restituire errore per email non valida', async () => {
            validators.isUsernameValid.mockReturnValue(true);
            validators.isEmailValid.mockReturnValue(false);

            const response = await request(app).post('/api/utenti/signup').send({
                nome: 'utente',
                cognome: 'test',
                email: 'invalidEmail',
                password: 'utentePassword1@',
                username: 'utenteTest',
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "error",
                errors: [{ field: 'email', message: 'Email non valida' }],
            });
        });

        test('Dovrebbe restituire errore per password non valida', async () => {
            validators.isUsernameValid.mockReturnValue(true);
            validators.isEmailValid.mockReturnValue(true);
            validators.isPasswordValid.mockReturnValue(false);

            const response = await request(app).post('/api/utenti/signup').send({
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                password: 'invalidPassword',
                username: 'utenteTest',
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "error",
                errors: [{ field: 'password', message: 'Password non valida' }],
            });
        });

        test('Dovrebbe restituire errore per username già in uso', async () => {
            validators.isUsernameValid.mockReturnValue(true);
            validators.isEmailValid.mockReturnValue(true);
            validators.isPasswordValid.mockReturnValue(true);
            validators.isUsernameTaken.mockResolvedValue(true);

            const response = await request(app).post('/api/utenti/signup').send({
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                password: 'utentePassword1@',
                username: 'utenteTest',
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "error",
                errors: [{ field: 'username', message: 'Username già in uso' }],
            });
        });

        test('Dovrebbe restituire errore per email già registrata', async () => {
            validators.isUsernameValid.mockReturnValue(true);
            validators.isEmailValid.mockReturnValue(true);
            validators.isPasswordValid.mockReturnValue(true);
            validators.isUsernameTaken.mockResolvedValue(false);
            validators.isEmailTaken.mockResolvedValue(true);

            const response = await request(app).post('/api/utenti/signup').send({
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                password: 'utentePassword1@',
                username: 'utenteTest',
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: "error",
                errors: [{ field: 'email', message: 'Email già registrata' }],
            });
        });

        test('Dovrebbe restituire errore del server durante la registrazione dell\'utente', async () => {
            validators.isUsernameValid.mockReturnValue(true);
            validators.isEmailValid.mockReturnValue(true);
            validators.isPasswordValid.mockReturnValue(true);
            validators.isUsernameTaken.mockResolvedValue(false);
            validators.isEmailTaken.mockResolvedValue(false);
            Utente.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/api/utenti/signup').send({
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                password: 'utentePassword1@',
                username: 'utenteTest',
            });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante la registrazione dell'utente",
                error: 'Database error',
            });
        });

    });

    describe('POST /api/utenti/login', () => {
        test('Dovrebbe restituire errore per utente non trovato', async () => {
            validators.getUtente.mockResolvedValue(null);

            const response = await request(app).post('/api/utenti/login').send({
                username: 'nonEsiste',
                password: 'passwordQualsiasi',
            });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Utente non trovato',
            });
        });

        test('Dovrebbe restituire errore per password sbagliata', async () => {
            const mockUtente = { _id: '123', username: 'utenteTest' };
            validators.getUtente.mockResolvedValue(mockUtente);
            validators.verifyPasswordByUsername.mockResolvedValue(false);

            const response = await request(app).post('/api/utenti/login').send({
                username: 'utenteTest',
                password: 'passwordSbagliata',
            });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Password sbagliata',
            });
        });

        test('Dovrebbe restituire un token JWT per login corretto', async () => {
            const mockUtente = { _id: '123', username: 'utenteTest' };
            validators.getUtente.mockResolvedValue(mockUtente);
            validators.verifyPasswordByUsername.mockResolvedValue(true);

            const response = await request(app).post('/api/utenti/login').send({
                username: 'utenteTest',
                password: 'passwordCorretta',
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toEqual({
                token: expect.any(String),
                loggedId: mockUtente._id,
                loggedUsername: mockUtente.username,
                self: `utenti/${mockUtente._id}`,
            });
        });

        test('Dovrebbe restituire errore del server durante il login', async () => {
            validators.getUtente.mockRejectedValue(new Error('Database error'));

            const response = await request(app).post('/api/utenti/login').send({
                username: 'utenteTest',
                password: 'passwordCorretta',
            });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante l'accesso dell'utente",
                error: 'Database error',
            });
        });
    });

    describe('GET /api/utenti/:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();

            /*const tokenCheckerSpy = jest.fn();
            tokenChecker.tokenChecker.mockResolvedValue(() => tokenCheckerSpy());
            jest.spyOn(tokenChecker, 'tokenChecker').mockImplementation((req, res, next) => {
                req.utenteLoggato = {
                    loggedId: '012345',
                    loggedUsername: 'utenteTest'
                };
                next();
            });*/
            /*jest.spyOn(tokenChecker, 'tokenChecker').mockReturnValue(() => (req, res, next) => {
            console.log('Mocked tokenChecker middleware');
            req.utenteLoggato = { loggedId: '012345', loggedUsername: 'utenteTest' };
            next();
        });*/
            jest.spyOn(Utente, 'findById').mockResolvedValue(loggedUser);
        });

        test('Dovrebbe restituire errore se nessun token è fornito', async () => {
            const response = await request(app).get(`/api/utenti/${loggedUser._id}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Nessun token fornito.'
            });
        });

        test('Dovrebbe restituire le informazioni complete dell\'utente se l\'utente cercato è l\'utente loggato', async () => {
            const response = await request(app)
                .get(`/api/utenti/${loggedUser._id}`)
                .set('Token', token);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                utente: {
                    _id: loggedUser._id,
                    nome: loggedUser.nome,
                    cognome: loggedUser.cognome,
                    email: loggedUser.email,
                    password: loggedUser.password,
                    username: loggedUser.username,
                    karma: loggedUser.karma,
                    tipoUtente: loggedUser.tipoUtente,
                    googleId: loggedUser.googleId,
                    following: loggedUser.following,
                    followers: loggedUser.followers,
                    interessi: loggedUser.interessi,
                }
            }
            );
        });

        test('Dovrebbe restituire errore se l\'utente non è trovato', async () => {
            Utente.findById.mockResolvedValue(null);

            const response = await request(app).get('/api/utenti/notFoundId').set('Token', token);;

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Utente non trovato' });
        });

        test('Dovrebbe restituire solo le informazioni pubbliche dell\'utente se l\'utente cercato non è l\'utente loggato', async () => {
            Utente.findById.mockResolvedValue(otherUser);
            const response = await request(app).get(`/api/utenti/${otherUser._id}`).set('Token', token);;

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                username: 'utenteTest2',
                tipoUtente: 'autenticato',
                nome: 'utente2',
                cognome: 'test2',
                karma: 1,
                interessi: ['Sport'],
            });
        });

        test('Dovrebbe restituire errore del server durante il recupero dell\'utente', async () => {
            Utente.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get(`/api/utenti/${loggedUser._id}`).set('Token', token);;

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante il recupero dell'utente",
                error: 'Database error',
            });
        });
    });

    describe('PUT /api/utenti/:id', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(Utente, 'findByIdAndUpdate').mockResolvedValue(updatedUser);
        });

        test('Dovrebbe restituire errore se nessun token è fornito', async () => {
            const response = await request(app)
                .put(`/api/utenti/${loggedUser._id}`)
                .send({ nome: updatedUser.nome });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Nessun token fornito.'
            });
        });

        test('Dovrebbe restituire 404 se l\'utente non è trovato', async () => {
            Utente.findByIdAndUpdate.mockResolvedValue(null); // Simula utente non trovato

            const response = await request(app)
                .put(`/api/utenti/${loggedUser._id}`)
                .set('Token', token)
                .send({ nome: updatedUser.nome });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Utente non trovato" });
        });

        test('Dovrebbe restituire 403 se si cerca di aggiornare i dati di un altro utente', async () => {
            Utente.findByIdAndUpdate.mockResolvedValue(otherUser);

            const response = await request(app)
                .put(`/api/utenti/${otherUser._id}`)
                .set('Token', token)
                .send({ nome: updatedUser.nome });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ message: "Impossibile modificare account altrui" });
        });

        test('Dovrebbe aggiornare l\'utente se l\'utente loggato è lo stesso dell\'utente da aggiornare', async () => {
            Utente.findByIdAndUpdate.mockResolvedValue(updatedUser);

            const response = await request(app)
                .put(`/api/utenti/${loggedUser._id}`)
                .set('Token', token)
                .send({ nome: updatedUser.nome });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ self: `utenti/${loggedUser._id}` });
        });

        test('Dovrebbe restituire errore del server durante l\'aggiornamento dell\'utente', async () => {
            Utente.findByIdAndUpdate.mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(app)
                .put(`/api/utenti/${loggedUser._id}`)
                .set('Token', token)
                .send({ nome: updatedUser.nome });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante l'aggiornamento dell'utente",
                error: 'Database error',
            });
        });
    });

    describe('GET /api/utenti/username/:username', () => {
        beforeEach(() => {
            jest.clearAllMocks();

            jest.spyOn(Utente, 'find').mockResolvedValue([]);
            jest.spyOn(Utente, 'findOne').mockResolvedValue(null);
        });

        test('Dovrebbe restituire solo informazioni pubbliche di un grande organizzatore se l\'utente non è loggato', async () => {
            Utente.find.mockResolvedValue([grandeOrganizzatore]);
            Utente.findOne.mockResolvedValue(grandeOrganizzatore);

            const response = await request(app)
                .get(`/api/utenti/username/${grandeOrganizzatore.username}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "utente": {
                    username: grandeOrganizzatore.username,
                    tipoUtente: grandeOrganizzatore.tipoUtente,
                    nome: grandeOrganizzatore.nome,
                    cognome: grandeOrganizzatore.cognome,
                    karma: grandeOrganizzatore.karma,
                    interessi: grandeOrganizzatore.interessi
                }
            });
        });

        test('Dovrebbe restituire errore 401 se l\'utente non è loggato e non sta cercando un grande organizzatore', async () => {
            Utente.find.mockResolvedValue([grandeOrganizzatore]);

            const response = await request(app)
                .get(`/api/utenti/username/${otherUser.username}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Nessun token fornito.'
            });
        });

        test('Dovrebbe restituire 404 se l\'utente non è trovato', async () => {
            Utente.findOne.mockResolvedValue(null);

            const response = await request(app)
                .get(`/api/utenti/username/notFoundUser`)
                .set('Token', token);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Utente non trovato" });
        });

        test('Dovrebbe restituire tutte le informazioni dell\'utente se l\'utente loggato è lo stesso dell\'utente cercato', async () => {
            Utente.findOne.mockResolvedValue(loggedUser);

            const response = await request(app)
                .get(`/api/utenti/username/${loggedUser.username}`)
                .set('Token', token);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ utente: loggedUser });
        });

        test('Dovrebbe restituire solo le informazioni pubbliche se l\'utente cercato non è l\'utente loggato', async () => {
            Utente.findOne.mockResolvedValue(otherUser);

            const response = await request(app)
                .get(`/api/utenti/username/${otherUser.username}`)
                .set('Token', token);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                "utente": {
                    username: otherUser.username,
                    tipoUtente: otherUser.tipoUtente,
                    nome: otherUser.nome,
                    cognome: otherUser.cognome,
                    karma: otherUser.karma,
                    interessi: otherUser.interessi
                }
            });
        });

        test('Dovrebbe restituire errore del server durante il recupero dell\'utente', async () => {
            Utente.findOne.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .get(`/api/utenti/username/${loggedUser.username}`)
                .set('Token', token);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante il recupero dell'utente",
                error: 'Database error',
            });
        });
    });
});
