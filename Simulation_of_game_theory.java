import Game_Theory.Game_theory;
public class Simulation_of_game_theory {
    public static final String[] player_id={"One_man","Zero_man","One_for_even_man","Zero_for_even_man","Tic_for_tac","Punishner","Sure","Player_1100","Player_0011","Alpha","Delta","Sigma","Tic_for_two_tac","Colombus","Joss","Johan","Tic_for_three_tac","Galileo","Sharp","Rayon","Gradual","Two_tic_for_tac"};
    public static int[] player_score=new int[player_id.length];
    public static int[] player_children=new int[player_id.length];
    public static int players_count=player_id.length;
    public static int[] player_wins=new int[player_id.length];
    public static int[] player_loses=new int[player_id.length];
    public static void play(int player_1,int player_2){
        for(int round=0;round<Game_theory.rounds;round++){
            int choice_1=Game_theory.Assigner(player_1, 0, round);
            player_children[player_1-1]+=(choice_1==1)?1:-1;
            int choice_2=Game_theory.Assigner(player_2, 1, round);
            player_children[player_2-1]+=(choice_2==1)?1:-1;
            Game_theory.input(round, choice_1, choice_2);
            Game_theory.scoring(round);
        }
    }
    public static void Assign(int i,int a,int j,int b){
        if(a>b){
            player_wins[i]+=1;
            player_loses[j]+=1;
        }else{
            if(a<b){
                player_wins[j]+=1;
                player_loses[i]+=1;
            }
            else if(a==b){
                player_wins[i]+=1;
                player_wins[j]+=1;
            }
        }
    }
    public static void main(String[] args) {
        setPlayer_loses();
        setPlayer_wins();
        for(int i=0;i<players_count;i++){
            player_children[i]=0;
        }
        for(int i=0;i<players_count;i++){
            //System.out.println(i);
            for(int j=i;j<players_count;j++){
                //System.out.println(j);
                Game_theory.score[0]=0;
                Game_theory.score[1]=0;
                play(i+1,j+1);
                player_score[i]+=Game_theory.score[0];
                player_score[j]+=Game_theory.score[1];
                Assign(i,player_score[i],j,player_score[j]);
            }
        }
        int[] copy_player_children=new int[players_count];
        System.arraycopy(player_children, 0, copy_player_children, 0, players_count);
        sortPlayerChildren(player_children);
        System.out.println("RANK LIST:");
        for(int i=players_count-1;i>=0;i--){
            System.out.println();
            for(int j=0;j<players_count;j++){
                if(player_children[i]==copy_player_children[j]){
                    System.out.print((players_count-i)+" ");
                    System.out.print(player_id[j]+"...."+player_children[i]+"    ");
                }
            }
        }
        System.out.println();
        System.out.println();
        for(int i=0;i<players_count;i++){
            System.out.println();
            System.out.print(player_id[i]+"....."+player_wins[i]+"....."+player_loses[i]);
        }
    }
    public static void sortPlayerChildren(int[] player_children) {
        if (player_children == null || player_children.length <= 1) {
            if (player_children == null) {
                System.err.println("Error: The array to be sorted is null.");
            }
            return;
        }

        quickSort(player_children, 0, player_children.length - 1);
    }

    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);

            quickSort(arr, low, pi - 1);

            quickSort(arr, pi + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];

        int i = (low - 1);

        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;

                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }

        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;

        return i + 1;
    }

    public static void setPlayer_wins() {
        for(int i=0;i<players_count;i++){
            player_wins[i]=0;
        }
    }
    public static void setPlayer_loses() {
        for(int i=0;i<players_count;i++){
            player_loses[i]=0;
        }
    }
}
