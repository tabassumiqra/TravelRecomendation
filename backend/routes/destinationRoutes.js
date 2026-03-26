import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDestinations, getDestinationById } from '../controllers/destinationController.js';

const router = express.Router();

// protect middleware can be injected into getDestinations if we want only logged-in users to search
// But here the protect is optional inside the controller to track history
const optionalAuth = (req, res, next) => {
    // Basic wrapper to not fail if no token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    next();
};

router.route('/').get(optionalAuth, getDestinations);
router.route('/:id').get(getDestinationById);

export default router;
