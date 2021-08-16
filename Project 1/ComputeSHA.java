import java.security.*;
import java.io.*;

public class ComputeSHA {
	public static void main(String args[]){
		try{
			MessageDigest msg =  MessageDigest.getInstance("SHA-1");
			FileInputStream inp = new FileInputStream(args[0]);
			File fi = new File(args[0]);
			byte buf[] = new byte[(int)fi.length()];
			inp.read(buf);
			msg.update(buf);
			byte outbuf[] = msg.digest();

                        StringBuilder out = new StringBuilder();
                        for(int i = 0; i < outbuf.length; i++)
                        {
				out.append(String.format("%02x",outbuf[i]));
                        }
                        System.out.print(out.toString() + "\n");

		}
		catch(Exception e){
			System.out.println(e);
			System.exit(1);
		}

	}

}
