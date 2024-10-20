import { app } from 'electron'
import express from 'express'
import fs, { stat } from 'fs'
import path from 'path'

const router = express.Router()
let downloadsDir = path.join(app.getPath('downloads'), 'ZenshinDownloads')

