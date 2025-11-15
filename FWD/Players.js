export function One_man(){
    return 1;
}
export function Zero_man(){
    return 0;
}
export function One_for_even_man(round){
    if((round+1)%2==0){
            return 1;
    }
    else{
            return 0;
    }
}
export function Zero_for_even_man(round){
    if((round+1)%2==0){
            return 0;
    }
    else{
            return 1;
    }
}
export function Player_1100(round){
        if(round%4==0 || (round-1)%4==0){
            return 1;
        }   
        return 0;
    }
export function Player_0011(round){
        if(round%4==0 || (round-1)%4==0){
            return 0;
        }   
        return 1;
    }
export function Alpha(round){
        if(round%4==0){
            return 0;
        }
        return 1;
    }
export function Delta(round){
        if(round%4==0){
            return 1;
        }
        return 0;
    }
export function Tic_for_Tac(choices,player_no,round){
    if(round==0){
        return 1;
    }
    let player=player_no==1?0:1;
    return choices[player][round-1];
}
export function Punisher(choices,player_no,round){
    if(round==0){
        return 1;
    }
    let player=player_no==1?0:1;
    if(choices[player][round-1]==0 || choices[player_no][round-1]==0){
            return 0;
    }
    return 1;
}
export function Colombus(choices,player_no,round){
    if(round<3){
            return 1;
        }
        if(choices[player_no][round-1]==0){
            return 0;
        }
        let pattern=new Array[3];
        let indicator=1;
        let player=player_no==1?0:1;
        for(let i=round-1,j=0;i>round-3;i--,j++){
            pattern[j]=choices[player][i];
        }
        if(pattern[0]==1 && pattern[1]==0 && pattern[2]==0){
            indicator=0;
        }
        if(pattern[0]==0 && pattern[1]==1 && pattern[2]==1){
            indicator=0;
        }
    return indicator;
}
export function Tic_for_2_Tac(choices,player_no,round){
    if(round<2){
            return 1;
        }
        let player=player_no==1?0:1;
        if(choices[player][round-1]+choices[player][round-2]==0){
            return 0;
        }
    return 1;
}
export function Joss(choices,player_no,round){
    if(round==0){
            return 1;
        }
        let player=player_no==1?0:1;
        if(choices[player][round-1]==1){
            return choices[player_no][round-1];
        }
        else{
            return (choices[player_no][round-1]==0?1:0);
        }   
}
export function Johan(choices,player_no,round){
    if(round==0){
            return 1;
        }
        let player=player_no==0?1:0;
    return (choices[player][round-1]==0?1:0);
}
export function Sure(choices,player_no,round,score){
    if(round<4){
        return 1;
    }
    let player=player_no==1?0:1;
    let flag=1;
    for(let i=round-1;i>=round-4;i--){
        if(score[player_no]<score[player]){
            if(choices[player][i]==0){
            flag=0;
        }
        }
            
    }
    return flag;
}
export function Sigma(choices,player_no,round,score){
        if(round<3){
            return 1;
        }
        let player=player_no==1?0:1;
            if(score[player]>score[player_no]){
                return 0;
            }
            return 1;
}
export function Random_man(){
    let i=(int)(Math.random()*10000);
        if(i<6000){
            return 1;
        }
        else{
            return 0;
        }
}