import { Controller, Get, Res, Header } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html')
  getStatus(@Res() res: Response) {
    console.log('✅ GET / route hit');
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Ochiga Backend</title>
        <style>
          body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .container {
            text-align: center;
            padding: 30px;
            border: 2px solid #dc3545;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          h1 {
            color: #dc3545;
            font-size: 2.5em;
          }
          p {
            font-size: 1.2em;
            margin-top: 10px;
            color: #555;
          }
          .emoji {
            font-size: 1.5em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Ochiga Backend is Live <span class="emoji">🚀</span></h1>
          <p>Smart estate & home automation platform</p>
        </div>
      </body>
      </html>
    `);
  }
}
