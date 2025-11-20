import Game_Theory.Game_theory;
public class Tournament_of_game_theory {
    public static final String[] player_id={"One_man","Zero_man","One_for_even_man","Zero_for_even_man","Tic_for_tac","Punishner","Sure","Player_1100","Player_0011","Alpha","Delta","Sigma","Tic_for_two_tac","Colombus","Joss","Johan","Tic_for_three_tac","Galileo","Sharp","Rayon","Gradual","Two_tic_for_tac"};
    public static int[] player_score=new int[player_id.length];
    public static int players_count=player_id.length;
    public static void play(int player_1,int player_2){
        for(int round=0;round<Game_theory.rounds;round++){
        int choice_1=Game_theory.Assigner(player_1, 0, round); 
        int choice_2=Game_theory.Assigner(player_2, 1, round);
            Game_theory.input(round, choice_1, choice_2);
            Game_theory.scoring(round);
        }
    }
    public static void main(String[] args) {
        for(int i=0;i<players_count;i++){
            //System.out.println(i);
            for(int j=i;j<players_count;j++){
                //System.out.println(j);
                Game_theory.score[0]=0;
                Game_theory.score[1]=0;
                play(i+1,j+1);
                player_score[i]+=Game_theory.score[0];
                player_score[j]+=Game_theory.score[1];
            }
        }
        int[] sorted_player_score=new int[players_count];
        System.arraycopy(player_score, 0, sorted_player_score, 0, players_count);
        sortPlayerChildren(sorted_player_score);
        
        System.out.println("RANK LIST:");
        for(int i=players_count-1;i>=0;i--){
            System.out.println();
            for(int j=0;j<players_count;j++){
                if(sorted_player_score[i]==player_score[j]){
                    System.out.print((players_count-i)+" ");
                    System.out.print(player_id[j]+"...."+sorted_player_score[i]+"    ");
                }
            }
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
}
