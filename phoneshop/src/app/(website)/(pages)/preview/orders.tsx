import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { items, shippingAddress, paymentMethod, shippingMethod, total } = req.body;

            if (!items || items.lenght === 0) {
                return res.status(400).json({ message: "The shopping cart is empty." });
            }
            const order = await prisma.orderDetails.create({
                data: {
                    shippingAddress,
                    paymentMethod,
                    shippingMethod,
                    total,
                    orderState: { create: { id: "pending" } },
                    items: {
                        create: items.map((item: any) => ({
                            name: item.name,
                            price: item.price,
                            qty: item.qty,
                            thumbnail: item.thumbnail,
                        })),
                    },
                },
                include: { items: true, orderState: true }
            });
            return res.status(201).json(order);
        } catch (error) {
            console.error("Error creating order:", error);
            return res.status(500).json({ message: "Something went wrong." });
        }
    } else {
        return res.status(405).json({
            message: "Method not allowed"})
        }

}
