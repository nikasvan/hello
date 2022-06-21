import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      return handlePost(req, res);
    default:
      return handleMethodNotAllowed(req, res);
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body);
  try {
    const result = await prisma.initEvent.create({
      data: {
        address_hash: data.addressHash,
      },
    });
    console.log(result);
    res.status(200).json(true);
  } catch (err) {
    console.error(err);
    res.status(500).json(false);
  }
};

const handleMethodNotAllowed = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(405).json('Method not allowed!!');
};