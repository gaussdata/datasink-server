import express from 'express'
import analysis from '@/controllers/analysis.controller.js'
import { validate } from '@/utils/validate.js'
import { pvuvValidators, topPagesValidators } from './analysis.validator.js'

const router = express.Router()

router.get('/count', analysis.getCount)
router.get('/view', analysis.getView)
router.get('/pvuv', validate(pvuvValidators), analysis.getPVUV)
router.get('/top-pages', validate(topPagesValidators), analysis.getTopPages)
router.get('/metrics', analysis.getMetrics)

export default router
