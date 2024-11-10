// import { NextApiRequest, NextApiResponse } from 'next';
// import { QuestionService } from '@/server/service/QuestionService'; // Your existing QuestionService
// import { auth } from '@clerk/nextjs/server'; // For authentication (if needed)

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { method } = req;
//   const { eventId } = req.query; // Extract the eventId from the URL parameters

//   const questionService = new QuestionService();

//   // Authentication (optional, based on your app's requirements)
//   const currentUser = auth();
//   if (!currentUser) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   if (method === 'POST') {
//     try {
//       // The questions should be passed in the body of the request
//       const questions = req.body;

//       // Use your existing createOneQuestion method to save the questions
//       const savedQuestions = await Promise.all(
//         questions.map((question: any) => 
//           questionService.createOneQuestion({
//             eventId: eventId as string,
//             prompt: question.prompt,
//             answer: question.answer || null
//           })
//         )
//       );

//       return res.status(200).json({ message: 'Questions saved successfully', savedQuestions });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'Failed to save questions' });
//     }
//   } else {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
  
export async function GET(request: NextRequest) {
  console.log(request);
  return NextResponse.json({message: "pong"}, {status:200})
}