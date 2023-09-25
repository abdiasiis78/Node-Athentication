import express from 'express';
import prisma from './lib/index.js';
import authenticate from './middleware/authenticate.js'

const router = express.Router();

router.get("/", async (req, res) => {
    try {

        const restaurant = await prisma.restaurant.findMany();
        if (restaurant.length === 0) {
            return res.status(404).json({ message: "restaurant not found" })
        }

        res.json(restaurant);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const restaurantId = await prisma.restaurant.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!restaurantId) {
            return res.status(404).json({ message: "restaurantId not found" })
        }

        res.json(restaurantId)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});



router.post('/', authenticate, async (req, res) => {
    try {

        const { name , ownerId, location } = req.body;

        const createRestaurant = await prisma.restaurant.create({
            data: {
                name: name,
                ownerId: ownerId,
                location: location,
            },
        });

        if (!createRestaurant) {
            return res.status(400).json({ message: "Restaurant was not created!" })
        }

        res.status(200).json({
            status: 200,
            message: "Restaurant successFully created!",
            data: createRestaurant

        })

    } catch (error) {
        res.status(500).json({ status: 500, message: error.message })
    }
});

router.put('/:id', authenticate ,  async (req, res) => {
    try {

        const { id } = req.params;
        const { name , ownerId, location } = req.body;

        const updateRestaurant = await prisma.restaurant.update({
            where: {
                id: Number(id),
            },

            data: {
                name: name,
                ownerId: ownerId,
                location: location,
            },
        });

        if (!updateRestaurant) {
            return res.status(400).json({ status: 400, message: "Restaurant was not updated!" })
        }

        res.status(200).json({
            status: 200,
            message: "Restaurant successFully updated!",
            data: updateRestaurant
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id',authenticate,  async (req, res) => {
    try {

        const { id } = req.params;

        const deleteRestaurant = await prisma.restaurant.delete({
            where: {
                id: Number(id),
            },
        });

        if (!deleteRestaurant) {
            return res.status(400).json({ message: "Restaurant was not  deleted!" })
        }

        res.status(200).json({ message: `Restaurant successFully deleted!` })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

export default router