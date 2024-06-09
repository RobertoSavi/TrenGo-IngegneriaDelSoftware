import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../../app.mjs';
import validators from "../validators/utentiValidators.mjs";
import Utente from '../models/utenteModel.mjs';
import middleware from '../middlewares/tokenChecker.mjs';
import { sendResetPasswordMail } from '../services/emailService.mjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

describe('utentiHandlers', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset all mocks
    });

    describe('POST /api/utenti/signup', () => {
        jest.spyOn(validators, 'isUsernameValid').mockReturnValue(true);
        jest.spyOn(validators, 'isEmailValid').mockReturnValue(true);
        jest.spyOn(validators, 'isPasswordValid').mockReturnValue(true);
        jest.spyOn(validators, 'isUsernameTaken').mockResolvedValue(false);
        jest.spyOn(validators, 'isEmailTaken').mockResolvedValue(false);
        jest.spyOn(validators, 'verifyPasswordByUsername').mockResolvedValue(true);
        jest.spyOn(validators, 'getUtente').mockResolvedValue(null);

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
        });

        jest.spyOn(Utente, 'findById').mockResolvedValue({
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


        jest.spyOn(middleware, 'tokenChecker').mockReturnValue(() => (req, res, next) => {
            req.utenteLoggato = { loggedId: '012345', loggedUsername: 'utenteTest' };
            next();
        });

        test('Dovrebbe restituire errore se nessun token è fornito', async () => {
            const response = await request(app).get('/api/utenti/012345');

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                message: 'Nessun token fornito.'
            });
        });

        test('Dovrebbe restituire le informazioni complete dell\'utente se l\'utente cercato è l\'utente loggato', async () => {
            const response = await request(app)
                .get('/api/utenti/012345')
                .set('Token', 'sampleToken');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                _id: '012345',
                nome: 'utente',
                cognome: 'test',
                email: 'utente.test@testing.com',
                username: 'utenteTest',
                karma: 0,
                tipoUtente: 'autenticato',
                googleId: null,
                following: [],
                followers: [],
                interessi: ['Altro'],
            });
        });

        test('Dovrebbe restituire errore se l\'utente non è trovato', async () => {
            Utente.findById.mockResolvedValue(null);

            const response = await request(app).get('/api/utenti/notFoundId');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Utente non trovato' });
        });

        test('Dovrebbe restituire solo le informazioni pubbliche dell\'utente se l\'utente cercato non è l\'utente loggato', async () => {
            const response = await request(app).get('/api/utenti/anotherUserId');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                username: 'utenteTest',
                tipoUtente: 'autenticato',
                nome: 'utente',
                cognome: 'test',
                karma: 0,
                interessi: ['Altro'],
            });
        });

        test('Dovrebbe restituire errore del server durante il recupero dell\'utente', async () => {
            Utente.findById.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/utenti/012345');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Errore durante il recupero dell'utente",
                error: 'Database error',
            });
        });
    });
});
