import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

/**
 * This class creates a server to handle requests and routes requests to /todos
 * to TodoHandler.
 */
public class Main {
    public static void main(String[] args) throws IOException {
        int port = 8000;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

        server.createContext("/todos", new TodoHandler());

        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port" + port);
    }
}
