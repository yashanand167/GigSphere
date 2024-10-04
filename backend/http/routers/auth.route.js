import { Router } from "express";
import passport from 'passport';
import { google_auth } from "../config/auth_config.js";
export const auth_router = Router();

auth_router.get('/google', google_auth.authenticate('google', {
    scope: ['profile']
}))