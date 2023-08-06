'use server';
const API_KEY = process.env.API_KEY as string;
const API_URL = process.env.API_URL as string;

interface ApiResult {
  phoneNumber: string;
  data: boolean;
}

export async function runApiCalls( numbers: string[], userId: string ): Promise<ApiResult[]> {
    const apiPromises = numbers.map(async (number) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
        },
          body: JSON.stringify({
            phoneNumber: number,
            uid: userId,
          }),
      });
  
      const data: ApiResult = await response.json();
      return data;
    });
  
    return Promise.all(apiPromises);
  }
