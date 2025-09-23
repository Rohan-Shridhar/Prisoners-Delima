package Game_Theory;
import Players.Decision;
import java.util.Scanner;
public class Game_theory {
    public static Scanner sc=new Scanner(System.in);
    public  static String Alice,Bob;
    public  static int rounds=setRounds();
    public  static final int[] score={0,0};
    public  static final int[][] choices=new int[2][Game_theory.rounds];
    private static int x=0;
    public  static int random_int_chooser(int i){
        do{
            x=(int)(((Math.random()*37773))/(37773/i));
        }while(x==0);
        return x;
    }
    public  static int Assigner(int player,int player_no,int round){
        //System.out.println("Function check 2");
        int choice=switch (player) {
                case 1 -> Decision.One_man();
                case 2 -> Decision.Zero_man();
                case 3 -> Decision.One_for_even_man(round);
                case 4 -> Decision.Zero_for_even_man(round);
                case 5 -> Decision.Tic_for_Tac(Game_theory.choices,player_no,round);
                case 6 -> Decision.Punisher(Game_theory.choices,player_no,round);
                case 7 -> Decision.Sure(Game_theory.choices, player_no, round, Game_theory.score);
                case 8 -> Decision.Player_1100(round);
                case 9 -> Decision.Player_0011(round);
                case 10 -> Decision.Alpha(round);
                case 11 -> Decision.Delta(round);
                case 12 -> Decision.Sigma(Game_theory.choices,player_no,round,Game_theory.score);
                case 13 -> Decision.Tic_for_2_Tac(Game_theory.choices, player_no, round);
                case 14 -> Decision.Colombus(Game_theory.choices, player_no, round);
                case 15 -> Decision.Joss(Game_theory.choices, player_no, round);
                case 16 -> Decision.Johan(Game_theory.choices, player_no, round);
                case 17 -> Decision.Tic_for_3_Tac(Game_theory.choices, player_no, round);
                case 18 -> Decision.Galileo(Game_theory.choices, player_no, round);
                case 19 -> Decision.Sharp(Game_theory.choices, player_no, round);
                case 20 -> Decision.Rayon(Game_theory.choices, player_no, round, Game_theory.score);
                case 21 -> Decision.Gradual(Game_theory.choices, player_no, round);
                case 22 -> Decision.Two_tic_for_tac(Game_theory.choices, player_no, round);
                case 23 -> Decision.Random_man();
                default ->1;
            };
            return choice;
    }
    private static int setRounds() {
        System.out.print("Number of rounds: ");
        //int r=sc.nextInt();
        int r=random_int_chooser(586);
        //int r=15644;
        System.out.println(r);
        return r;
    }
    public  static void input(int round,int x,int y){
        choices[0][round]=x;
        choices[1][round]=y;
    }
    public  static void scoring(int round){
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
    private  static void draw(){
        if(score[0]==score[1]){
            System.out.println("Draw");
            display_choices();
        }
    }
    private  static void winner(){
        System.out.println("Winner is "+(score[0]>score[1]?Alice:Bob));
        display_choices();
    }
    private  static void display(){
        for(int i=0;i<2;i++){
        if(i==0){
        System.out.print("[");}
        System.out.print(score[i]);
        if(i==1){
        System.out.println("]");}
        else{
        System.out.print(" , ");}}
    }
    private static void display_choices(){
        System.out.println("Want choices?");
        x=sc.nextInt();
        if(x==1){
            for(int i=0;i<rounds;i++){
                System.out.print("[");
                for(int j=0;j<2;j++){
                    System.out.print(choices[j][i]);
                    if(j==0){
                        System.out.print(" , ");
                }
                else{
                    System.out.println("]");
                }
            }
        }
        System.exit(0);}
    }
    public static void Main(String player_1,String player_2){
        Alice=player_1;
        Bob=player_2;
        display();
        draw();
        winner();
    }

    public static int getRounds() {
        return rounds;
    }

}
