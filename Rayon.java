package Players;

public class Rayon {
    private static int beta(int round){
        if((round-1)%4==0){
            return 0;
        }
        return 1;
    }
    private static int gamma(int round){
        if((round-1)%4==0){
            return 1;
        }
        return 0;
    }
    private static int alter_1(int score_1,int score_2,int choice_1,int choice_2){
        {if(score_1>score_2){
            return choice_1;
        }
        return choice_2;}
    }
    private static int alter_2(int score_1,int score_2,int choice_1,int choice_2){
        {if(score_1>score_2){
            return choice_2;
        }
        return choice_1;}
    }
    private static boolean Zero(int[] arr){
        int sum=0;
        for(int i:arr){
            sum+=i;
        }
        return sum==0;
    }
    private static boolean One(int[] arr){
        for(int i:arr){
            if(i==0){
                return false;
            }
        }
        return true;
    }
    private static boolean Zero_even(int[] arr){
        boolean flag=true;
        for(int i=0;i<arr.length;i++){
            if(i%2==0 && arr[i]==0){
                flag=false;
                break;
            }
            if(i%2!=0 && arr[i]==1){
                flag=false;
                break;
            }
        }
        return flag;
    }
    private static boolean One_even(int[] arr){
        boolean flag=true;
        for(int i=0;i<arr.length;i++){
            if(i%2==0 && arr[i]==1){
                flag=false;
                break;
            }
            if(i%2!=0 && arr[i]==0){
                flag=false;
                break;
            }
        }
        return flag;
    }
    private static int pattern(int[] arr){
        if(Zero(arr)){
            return 1;
        }
        if(One(arr)){
            return 2;
        }
        if(Zero_even(arr)){
            return 3;
        }
        if(One_even(arr)){
            return 4;
        }
        return 0;
    }
    private static int answer(int type_1,int type_2,int round,int score_1,int score_2,int choice_1,int choice_2){
        if(type_1==type_2){
            if(type_1==1){
                return 1;
            }
            if(type_1==2){
                return 0;
            }
            if(type_1==3){
                if((round+1)%2==0){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            if(type_1==4){
                if((round+1)%2==0){
                    return 0;
                }
                else{
                    return 1;
                }
            }
            return 1;
        }
        if(type_1!=type_2){
            if(type_1+type_2==7){
                return alter_2(score_1,score_2,choice_1,choice_2);
            }
            if(type_1+type_2==3){
                return alter_1(score_1,score_2,choice_1,choice_2);
            }
            if(type_1+type_2==4){
                return Alpha.decision(round);
            }
            if(type_1+type_2==5){
                if(type_1==1 || type_2==1){
                return beta(round);}
                else{
                return gamma(round);}
            }
            if(type_1+type_2==6){
                return Delta.decision(round);
            }
            return 1;
        }
        return 0;
    }
    public static int decision(int round,int[][] choices,int player_no,int[] score){
        if(round<2){
            int a=(int)(Math.random()*100);
            if(a<60){
                return  1;
            }
            return  0;
        }
        int[] choice_1=new int[round+1];
        int[] choice_2=new int[round+1];
        int player_1,player_2,score_1,score_2;
        switch (player_no) {
            case 0 -> {
                player_1=1;
                player_2=2;
                score_1=score[1];
                score_2=score[2];
            }
            case 1 -> {
                player_1=0;
                player_2=2;
                score_1=score[0];
                score_2=score[2];
            }
            default -> {
                player_1=0;
                player_2=1;
                score_1=score[0];
                score_2=score[1];
            }
        }
        for(int i=0;i<round+1;i++){
            choice_1[i]=choices[player_1][i];
            choice_2[i]=choices[player_2][i];
        }
        int type_1;
        int type_2;
        type_1=pattern(choice_1);
        type_2=pattern(choice_2);
        int response=answer(type_1,type_2,round,score_1,score_2,choice_1[round-1],choice_2[round-1]);
        return response;
    }
}