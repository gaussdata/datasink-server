import express from 'express'
import analysis from '@/controllers/analysis.controller.js'
import { validate } from '@/utils/validate.js'
import { dateValidators } from './analysis.validator.js'

const router = express.Router()

router.get('/metrics', analysis.getMetrics)
router.get('/pvuv', validate(dateValidators), analysis.getPVUV)
router.get('/top-pages', validate(dateValidators), analysis.getTopPages)
router.get('/top-referers', validate(dateValidators), analysis.getTopReferers)
router.get('/top-oses', validate(dateValidators), analysis.getTopOs)
router.get('/top-browsers', validate(dateValidators), analysis.getTopBrowser)

export default router
