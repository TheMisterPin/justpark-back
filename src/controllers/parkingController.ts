import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
async function getAllParkings(
  req: express.Request,
  response: express.Response,
) {
  await prisma.parking.findMany().then((parkings) => response.json(parkings));
}
async function getParkingById(
  req: express.Request,
  response: express.Response,
) {
  const { parkingID } = req.params;
  await prisma.parking
    .findUnique({ where: { id: parseInt(parkingID) } })
    .then((parking) => response.json(parking));
    prisma.$disconnect
}

async function createParking(req: express.Request, response: express.Response) {
  const { name, location } = req.body;
  await prisma.parking
    .create({ data: { name, location } })
    .then((parking) => response.json(parking));
}

export { getAllParkings, getParkingById, createParking };
