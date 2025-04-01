import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * This class manages the JDBC connection to the SQLite database;
 */
public class DB {
    private static final String URL = 
            "jdbc:sqlite:" +
            "d:/my-files/coding-projects/vanilla-todo-app/database.db";

    /**
     * Get the Connection to the SQLite database.
     * @return Connection to database
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL);
    }
}
