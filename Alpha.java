package Players;

public class Alpha {
    protected static int decision(int round){
        if(round%4==0){
            return 0;
        }
        return 1;
    }
}
