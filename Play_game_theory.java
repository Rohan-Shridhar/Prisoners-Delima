import Game_Theory.Game_theory;
import Players.Name;
import java.util.Scanner;

public class Play_game_theory {
    public static Scanner sc=new Scanner(System.in);
    public static void main(String[] args) {
        String[] players={"One_man","Zero_man","One_for_even_man","Zero_for_even_man","Tic_for_tac","Punishner","Sure","Player_1100","Player_0011","Alpha","Delta","Sigma","Tic_for_2_tac","Colombus","Joss","Johan","Tic_for_3_tac","Galileo","Sharp","Rayon","Gradual","Two_tic_for_tac","Random_man"};
        int[] player=new int[2];
        for(int k=0;k<2;k++){
            if(k==0){
                System.out.println("Choose player "+(k+1)+"  (0 if you want to play)");
            for(int i=0;i<players.length;i++){
                System.out.println(players[i]+"..................."+(i+1));
            }
        }
            //player[k]=Game_theory.random_int_chooser(players.length);
            //player[k]=k==0?15:sc.nextInt();
            //player[k]=k==0?0:Game_theory.random_int_chooser(16);
            //System.out.println(player[k]);
            player[k]=sc.nextInt();
        }
        int[] choice=new int[2];
        
        for(int i=0;i<Game_theory.rounds;i++){
            for(int k=0;k<2;k++){
                int User_input;
                if(player[k]==0){
                    //System.out.println("Function check 1");
                    System.out.println("Round "+(i+1));
                    User_input=sc.nextInt();
                    choice[k]=User_input;
                }else{
                choice[k]=Game_theory.Assigner(player[k],k,i);
            }
        }
            Game_theory.input(i,choice[0],choice[1]);
            Game_theory.scoring(i);
        }
        String[] names=new String[2];
        for(int k=0;k<2;k++){
            names[k]=switch (player[k]) {
                case 1 ->Name.One_man;
                case 2 ->Name.Zero_man;
                case 3 ->Name.One_for_even_man;
                case 4 ->Name.Zero_for_even_man;
                case 5 ->Name.Tic_for_tac;
                case 6 ->Name.Punisher;
                case 7 ->Name.Sure;
                case 8 ->Name.Player_1100;
                case 9 ->Name.Player_0011;
                case 10 ->Name.Alpha;
                case 11 ->Name.Delta;
                case 12 ->Name.Sigma;
                case 13 ->Name.Tic_for_2_tac;
                case 14 ->Name.Colombus;
                case 15 ->Name.Joss;
                case 16 ->Name.Johan;
                case 17 ->Name.Tic_for_3_tac;
                case 18 ->Name.Galileo;
                case 19 ->Name.Sharp;
                case 20 ->Name.Rayon;
                case 21 ->Name.Gradual;
                case 22 ->Name.Two_tic_for_tac;
                case 23 ->Name.Random_man;
                default ->"You";
            };
        }
        System.out.println(names[0]+" VS "+names[1]);
        Game_theory.Main(names[0],names[1]);
    }
}
