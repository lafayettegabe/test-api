'use server';
import { bill } from './auth';

const API_KEY = process.env.API_KEY as string;
const API_URL = process.env.API_URL as string;

interface ApiResult {
  phoneNumber: string;
  data: boolean;
}

type DataType = {
  email: string;
  credits: string;
  sub: string;
  acessToken: string;
}

export async function runApiCalls( numbers: string[], user: DataType ): Promise<ApiResult[]> {
  try {
    var price = 1
    if(numbers.length === 10) {
      price = 2;
    } else if(numbers.length === 100) {
      price = 3;
    } else if(numbers.length === 1000) {
      price = 4;
    }

    price = price * numbers.length;
    const newCredits = parseInt(user.credits) - price

    console.log('Billing user...')

    if(newCredits < 0) {
      throw new Error('Insufficient credits');
    } else {
      await bill(user.acessToken, newCredits.toString());
    }

    console.log('Billing complete.')

    const apiPromises = numbers.map(async (number) => {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY,
          },
            body: JSON.stringify({
              phoneNumber: number,
              uid: user.email,
            }),
        });
    
        const data: ApiResult = await response.json();
        return data;
      });
    
      return Promise.all(apiPromises);
  } catch (error) {
    console.error('API error:', error);
    return [];
  }
}
