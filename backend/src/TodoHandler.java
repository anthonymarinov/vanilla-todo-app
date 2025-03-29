import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.stream.Collectors;

/**
 * This class handles the requests to /todos and performs CRUD operations on
 * the SQLite database.
 */
public class TodoHandler implements HttpHandler {
    /**
     * This method reads the request method from the HTTP request (exchange)
     * and calls the appropeiate class method to deal with the request.
     * @param exchange HTTP exchange (request) that is sent to server
     * @throws IOException Error when reading/writing to exchange
     */
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();

        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", 
                    "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", 
                    "Content-Type");
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        try {
            switch (method) {
                case "GET":
                    this.handleGet(exchange);
                    break;
                case "POST":
                    this.handlePost(exchange);
                    break;
                case "PUT":
                    this.handlePut(exchange);
                    break;
                case "DELETE":
                    this.handleDelete(exchange);
                    break;
                default:
                    this.sendResponse(exchange, 405, "Invalid Method");
            }
        } catch (Exception e) {
            e.printStackTrace();
            this.sendResponse(exchange, 
                    500, 
                    "{\"error\": \"Server Error: " + 
                    e.getMessage() + "\"}"
            );
        }
    }

    /**
     * This method gets the all todos from the database and returns them in a 
     * JSON format in the HTTP exchange.
     * @param exchange
     * @throws IOException
     * @throws SQLException
     */
    private void handleGet(HttpExchange exchange) 
            throws IOException, SQLException {
        Connection conn = DB.getConnection();
        Statement stmt = conn.createStatement();
        String sql = "SELECT id, item FROM todos";
        ResultSet rs = stmt.executeQuery(sql);

        StringBuilder json = new StringBuilder();
        json.append("[");
        boolean first = true;
        while (rs.next()) {
            if (!first) {
                json.append(",");
            }
            json.append("{")
                .append("\"id\":").append(rs.getInt("id")).append(",")
                .append("\"item\":\"").append(rs.getString("item")).append("\"")
                .append("}");
            first = false;
        }

        json.append("]");

        rs.close();
        stmt.close();
        conn.close();

        this.sendResponse(exchange, 200, json.toString());
    }

    /**
     * This method posts a new todo to the database.
     * @param exchange
     * @throws IOException
     * @throws SQLException
     */
    private void handlePost(HttpExchange exchange)
            throws IOException, SQLException {
        InputStreamReader inStreamRead = new InputStreamReader(
                exchange.getRequestBody(), StandardCharsets.UTF_8);
        BufferedReader buffRead = new BufferedReader(inStreamRead);
        String body = buffRead.lines().collect(Collectors.joining("\n"));
        
        String item = body.replaceAll(".*\"item\"\\s*:\\s*\"([^\"]+)\".*", "$1");

        Connection conn = DB.getConnection();
        String sql = "INSERT INTO todos (item) VALUES (?)";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, item);
        int rows = pstmt.executeUpdate();
        pstmt.close();
        conn.close();
        inStreamRead.close();
        buffRead.close();

        this.sendResponse(
                exchange, 
                201, 
                "{\"message\": \"Todo created\", \"rows\": " + rows + "}"
        );
    }

    /**
     * This method updates a todo in the database.
     * @param exchange
     * @throws IOException
     */
    private void handlePut(HttpExchange exchange) 
            throws IOException, SQLException {
        InputStreamReader inStreamReader = new InputStreamReader(
                exchange.getRequestBody(), StandardCharsets.UTF_8);
        BufferedReader buffReader = new BufferedReader(inStreamReader);
        String body = buffReader.lines().collect(Collectors.joining("\n"));

        String idString = body.replaceAll(".*\"id\"\\s*:\\s*(\\d+).*", "$1");
        int id = Integer.parseInt(idString);
        String item = body.replaceAll(".*\"item\"\\s*:\\s*\"([^\"]+)\".*", "$1");

        Connection conn = DB.getConnection();
        String sql = "UPDATE todos" + 
                "SET item = " + item +
                "WHERE id = " + id;
        PreparedStatement pstmt = conn.prepareStatement(sql);
        int rows = pstmt.executeUpdate();
        pstmt.close();
        conn.close();
        inStreamReader.close();
        buffReader.close();

        this.sendResponse(
                exchange, 
                200, 
                "{\"message\": \"Todo updated\", \"rows\": " + rows + "}"
        );
    }

    /**
     * This method deletes a todo from the database.
     * @param exchange
     * @throws IOException
     */
    private void handleDelete(HttpExchange exchange) throws IOException {
        // TODO *****
        this.sendResponse(
                exchange,
                200,
                "{\"message\": \"DELETE method not implemented yet\"}"
        );
    }

    private void sendResponse(
            HttpExchange exchange, int statusCode, String response) 
            throws IOException {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", 
                "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", 
                "Content-Type");
        exchange.getResponseHeaders().add("Content-Type", "application/json");

        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(bytes);
        os.close();
    }
}
