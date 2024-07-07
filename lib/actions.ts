"use server"

import prisma from "./prisma"

export const test = async (str: string) => {
    const series = await prisma.serie.findMany({
        where: {
            title: {
                contains: str,
                mode: "insensitive",
            },
        }
    })

    return series
}