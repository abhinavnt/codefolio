import { verify } from 'jsonwebtoken'
import {RedisClient} from '../config/redis'
import dotenv from 'dotenv'
import { token } from 'morgan'


dotenv.config()


export const verifyResetToken=async (token:string,expectedPurpose:string)=>{
    try {
        const currentLink= `${process.env.CLIENT_URL!}/reset-password?token=${token}`

        const decoded=verify(token,process.env.ACCESS_TOKEN_SECRET!) as {
            userId:string
             email:string 
             purpose:string
            }

        if(decoded.purpose !== expectedPurpose){
            throw new Error('Invalid token purpose')
        }

        const storedLink= await RedisClient.get(`magicLink:${decoded.email}`)

        if(!storedLink) throw new Error('Invalid or expired token')

            const parsedStoredLink = JSON.parse(storedLink);

            if(parsedStoredLink.magicLink !== currentLink)
                 throw new Error("Invalid or expired token")

            return decoded
            
    } catch (error) {
        throw new Error('Invalid or expired token')
    }
























}
