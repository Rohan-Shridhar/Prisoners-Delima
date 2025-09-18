package Players;

public class Decision {
    //Pattern Players --- 8
    public static int One_man(){//good player
        return 1;
    }
    public static int Zero_man(){//bad player
        return 0;
    }
    public static int One_for_even_man(int round){//bad player
        if((round+1)%2==0){
            return 1;
        }
        else{
            return 0;
        }
    }
    public static int Zero_for_even_man(int round){//bad player
        if((round+1)%2==0){
            return 0;
        }
        else{
            return 1;
        }
    }
    public static int Player_1100(int round){//bad player
        if(round%4==0 || (round-1)%4==0){
            return 1;
        }   
        return 0;
    }
    public static int Player_0011(int round){//bad player
        if(round%4==0 || (round-1)%4==0){
            return 0;
        }   
        return 1;
    }
    public static int Alpha(int round){//bad player
        if(round%4==0){
            return 0;
        }
        return 1;
    }
    public static int Delta(int round){//bad player
        if(round%4==0){
            return 1;
        }
        return 0;
    }
    public static int Random_man(){//bad player
        int i=(int)(Math.random()*10000);
        if(i<6000){
            return 1;
        }
        else{
            return 0;
        }
    }
    // Cruel Players --- 2
    public static int Johan(int[][] choices,int player_no,int round){//bad player
        if(round==0){
            return 1;
        }
        int player=player_no==0?1:0;
        return (choices[player][round-1]==0?1:0);
    }
    public static int Rayon(int[][] choices,int player_no,int round,int[] score){//bad player
        if(round<10){
            return 1;
        }
        if(round==10){
            return 0;
        }
        int player=player_no==0?1:0;
        if(choices[player_no][round-2]==0){
            if(choices[player][round-1]==1){
                return 0;
            }else{
                return 1;
            }
        }
        if(choices[player][round-1]+choices[player][round-2]==0){
            return 0;
        }
        if(score[player_no]<score[player]){
            return 0;
        }
        return choices[player][round-1];
    }
    // TFT Players --- 4
    public static int Tic_for_Tac(int[][] choices,int player_no,int round){//good player
        if(round==0){
            return 1;
        }
        int player=player_no==1?0:1;
        return choices[player][round-1];
    }
    public static int Tic_for_2_Tac(int[][] choices,int player_no,int round){//good player
        if(round<2){
            return 1;
        }
        int player=player_no==1?0:1;
        if(choices[player][round-1]+choices[player][round-2]==0){
            return 0;
        }
        return 1;
    }
    public static int Tic_for_3_Tac(int[][] choices,int player_no,int round){//good player
        if(round<3){
            return 1;
        }
        int player=player_no==1?0:1;
        if(choices[player][round-1]+choices[player][round-2]+choices[player][round-2]==0){
            return 0;
        }
        return 1;
    }
    public static int Two_tic_for_tac(int[][] choices,int player_no,int round){//good player
        if(round==0){
            return 1;
        }
        int player=player_no==0?1:0;
        if(choices[player][round-1]==0){
            return 0;
        }
        if(round!=0 && round!= 1 && choices[player][round-2]==0){
            return 0;
        }
        return 1;
    }
    // Ruthless Players --- 5
    public static int Punisher(int[][] choices,int player_no,int round){//good player
        if(round==0){
            return 1;
        }
        int player=player_no==1?0:1;
        if(choices[player][round-1]==0 || choices[player_no][round-1]==0){
            return 0;
        }
        return 1;
    }
    public static int Colombus(int[][] choices,int player_no,int round){//good player
        if(round<2){
            return 1;
        }
        int player=player_no==1?0:1;
        if(choices[player][round-1]+choices[player][round-2]==0 || choices[player_no][round-1]==0){
            return 0;
        }
        return 1;
    }
    public static int Galileo(int[][] choices,int player_no,int round){//good player
        if(round<3){
            return 1;
        }
        int player=player_no==1?0:1;
        if(choices[player][round-1]+choices[player][round-2]+choices[player][round-3]==0 || choices[player_no][round-1]==0){
            return 0;
        }
        return 1;
    }
    public static int Gradual(int[][] choices,int player_no,int round){//good player
        if(round==0){
            return 1;
        }
        int player=player_no==0?1:0;
        int defects=0,taken=0;
        for(int i=0;i<round;i++){
            if(choices[player][i]==0){
                defects+=1;
            }
            if(choices[player_no][i]==0){
                taken+=1;
            }
        }
        int revenge=0;
        for(int i=1;i<=defects;i++){
            revenge+=i;
        }
        if(revenge>taken){
            return 0;
        }
        return 1;
    }
    public static int Sharp(int[][] choices,int player_no,int round){//good player
        if(round==0){
            return 1;
        }
        int player=player_no==0?1:0;
        if(choices[player][0]==0 || choices[player_no][round-1]==0){
            return 0;
        }
        return 1;
    }
    // Special Players --- 3
    public static int Sure(int[][] choices,int player_no,int round,int[] score){//good player
        if(round<2){
            return 1;
        }
        int player=player_no==1?0:1;
        int flag=1;
            for(int i=round-1;i>=round-2;i--){
                if(choices[player][i]==0){
                    if(score[player_no]<score[player]){
                    flag=0;
                }
            }     
        }
        return flag;
    }
    public static int Sigma(int[][] choices,int player_no,int round,int[] score){//good player
        //System.out.println("function check 1");
        if(round<3){
            //System.out.println("function check 2");
            return 1;
        }
        int player=player_no==1?0:1;
            if(score[player]>score[player_no]){
                //System.out.println("function check 5");
                return 0;
            }
            return 1;
    }
    public static int Joss(int[][] choices,int player_no,int round){//good player
        if(round==0){
            return 1;
        }
        int player=player_no==1?0:1;
        if(choices[player][round-1]==1){
            return choices[player_no][round-1];
        }
        else{
            return (choices[player_no][round-1]==0?1:0);
        }
    }
}
