import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;

/**
 * This class handles the requests to /todos and performs CRUD operations on
 * the SQLite database.
 */
public class TodoHandler implements HttpHandler {

    private Gson gson = new Gson();

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
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", 
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

        List<Todo> todos = new ArrayList<>();
        while (rs.next()) {
            Todo todo = new Todo();
            todo.setId(rs.getInt("id"));
            todo.setItem(rs.getString("item"));
            todos.add(todo);
        }
        rs.close();
        stmt.close();
        conn.close();

        String jsonResponse = gson.toJson(todos);
        this.sendResponse(exchange, 200, jsonResponse);
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

        try {
            Todo newTodo = gson.fromJson(body, Todo.class);
            if (newTodo == null || newTodo.getItem() == null) {
            this.sendResponse(exchange, 400, "{\"error\":\"Invalid Todo data\"}");
            return;
            }

            Connection conn = DB.getConnection();
            String sql = "INSERT INTO todos (item) VALUES (?)";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, newTodo.getItem());
            int rows = pstmt.executeUpdate();
            pstmt.close();
            conn.close();

            this.sendResponse(exchange, 200, "{\"message\": \"Todo created\", \"rows\": " + rows + "}");
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
            this.sendResponse(exchange, 400, "{\"error\":\"Invalid JSON\"}");
        } finally {
            buffRead.close();
            inStreamRead.close();
        }
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

        try {
            Todo updateTodo = gson.fromJson(body, Todo.class);

            String path = exchange.getRequestURI().getPath();
            String[] segments = path.split("/");
            if (segments.length < 3) {
                this.sendResponse(exchange,
                    400,
                    "{\"error\": \"Todo ID not provided.\"}");
            }
            int id = Integer.parseInt(segments[2]);

            Connection conn = DB.getConnection();
            String sql = "UPDATE todos SET item = ? WHERE id = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, updateTodo.getItem());
            pstmt.setInt(2, id);
            int affectedRows = pstmt.executeUpdate();
            pstmt.close();
            conn.close();

            if (affectedRows > 0) {
                this.sendResponse(exchange,
                        200,
                        "{\"message\": \"Todo successfully updated.\"}");
            } else {
                this.sendResponse(exchange,
                        404,
                        "{\"error\": \"Todo not found.\"}");
            }
        } catch (JsonSyntaxException e) {
            e.printStackTrace();
            this.sendResponse(exchange, 500, "{\"error\":\"Invalid JSON\"}");
        }
    }

    /**
     * This method deletes a todo from the database.
     * @param exchange
     * @throws IOException
     */
    private void handleDelete(HttpExchange exchange) 
            throws IOException, SQLException {
        try {
            String path = exchange.getRequestURI().getPath();
            String[] segments = path.split("/");
            if (segments.length < 3) {
                this.sendResponse(exchange, 
                        400, 
                        "{\"error\": \"Todo ID not provided.\"}");
            }
            int id = Integer.parseInt(segments[2]);

            Connection conn = DB.getConnection();
            String sql = "DELETE FROM todos WHERE id = ?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, id);
            int affectedRows = pstmt.executeUpdate();
            pstmt.close();
            conn.close();

            if (affectedRows > 0) {
                this.sendResponse(exchange,
                        200,
                        "{\"message\": \"Todo successfully deleted.\"}");
            } else {
                this.sendResponse(exchange,
                        404,
                        "{\"error\": \"Todo not found.\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            this.sendResponse(exchange, 
                    500,
                    "{\"error\": \"Server Error: " + e.getMessage() + "\"}");
        }
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
