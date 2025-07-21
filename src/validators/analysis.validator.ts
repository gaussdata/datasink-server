import { query } from 'express-validator';

// 使用 express-validator 进行参数校验，这里假设需要校验的参数示例，可根据实际需求修改
export const pvuvValidators = [
    query('start_time').optional().isInt().withMessage("必须是数字"),
    query('end_time').optional().isInt().withMessage("必须是数字"),
    query('date_level').optional().isIn(['hour', 'day', 'week', 'month']).withMessage("必须是hour, day, week, month中的一个"),
];

export const topPagesValidators = [
    query('start_time').optional().isInt().withMessage("必须是数字"),
    query('end_time').optional().isInt().withMessage("必须是数字"),
];
