"use server";
import { headers } from 'next/headers'

export const GetEmailHeader = async () => {
   //Headerからemailを取得
   const headersList = await headers();
   const userEmail = headersList.get('X-User-Email');
   return userEmail;
};