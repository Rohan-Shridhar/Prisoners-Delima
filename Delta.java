package Players;

public class Delta {
    protected static int decision(int round){
        if(round%4==0){
            return 1;
        }
        return 0;
    }
}
