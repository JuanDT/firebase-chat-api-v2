import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviromentAI, environment } from 'src/environments/environment'; // Asegúrate de que la importación sea correcta
import { from, filter, map } from 'rxjs';
import { Configuration, OpenAIApi } from "openai";
import { data } from 'jquery';
import * as $ from 'jquery';



const APIKEY = enviromentAI.apiKey;


@Injectable({
  providedIn: 'root',
})
export class ChatGPTService {
  

  constructor() { }

  readonly configurarion = new Configuration({
    apiKey: APIKEY
  });

  readonly openai = new OpenAIApi(this.configurarion);

  getDataFromOpenAI(text: string){
       from(this.openai.createCompletion({
          model: 'text-davinci-003',
          prompt: text,
          max_tokens: 256,
          temperature:  0.7
        })).pipe(

            filter(resp=>!!resp && !!resp.data),
            map(resp=>resp.data),
            filter((data:any)=>(

            data.choices && data.choices.length > 0 && data.choices[0].text        
          )),
          map(data=>data.choices[0].text)

         ).subscribe(data=>{
          console.log(data);

          $('.respuesta').append(`
          <ul class="list-group mb-2">
          <li class="list-group-item text-light" style="background-color:rgb(127, 130, 130);">${data}</li><br>
          </ul>
          `)
         })
        
  }
}
