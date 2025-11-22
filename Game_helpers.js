import { One_man,Zero_man,One_for_even_man,Zero_for_even_man,Player_0011,Player_1100,Random_man,Tic_for_Tac,Tic_for_2_Tac,Punisher,Colombus,Johan,Joss,Sure,Sigma } from "./Players";
export function Assigner(player,player_no,round){
    let choice=0;
    switch(player) {
                case 1 :choice=One_man();break;
                case 2 :choice=Zero_man();break;
                case 3 :choice=One_for_even_man(round);break;
                case 4 :choice=Zero_for_even_man(round);break;
                case 5 :choice=Tic_for_Tac(Game_theory.choices,player_no,round);break;
                case 6 :choice=Punisher(Game_theory.choices,player_no,round);break;
                case 7 :choice=Sure(Game_theory.choices, player_no, round, Game_theory.score);break;
                case 8 :choice=Player_1100(round);break;
                case 9 :choice=Player_0011(round);break;
                case 10 :choice=Alpha(round);break;
                case 11 :choice=Delta(round);break;
                case 12 :choice=Sigma(Game_theory.choices,player_no,round,Game_theory.score);break;
                case 13 :choice=Tic_for_2_Tac(Game_theory.choices, player_no, round);break;
                case 14 :choice=Colombus(Game_theory.choices, player_no, round);break;
                case 15 :choice=Joss(Game_theory.choices, player_no, round);break;
                case 16 :choice=Johan(Game_theory.choices, player_no, round);break;
                case 17 :choice=Random_man();break;
                default :choice=1;
            };
            return choice;
}
export let score=[0,0];
export let rounds=90;
let choices = Array.from({ length: 3 }, () => Array(rounds).fill(null));
export function input(round,x,y){
        choices[0][round]=x;
        choices[1][round]=y;
}
export function scoring(round){
        if(choices[0][round]==choices[1][round]){
            if(choices[0][round]==1){
                score[0]+=3;
                score[1]+=3;
            }
            else{
                score[0]+=1;
                score[1]+=1;
            }
        }
        else if(choices[0][round]<choices[1][round]){
            score[0]+=5;
        }
        else if(choices[1][round]<choices[0][round]){
            score[1]+=5;
        }
}