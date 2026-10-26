package src;

import java.io.*;
import java.util.*;

public class DatabaseManager {
    private static final String USER_DB_FILE = "users_hashtable.dat";
    private static final String PENDING_JOBS_FILE = "pending_queue.dat";
    private static final String HISTORY_DB_FILE = "history_stacks.dat";

    public static void saveAll(CustomHashTable userTable, Queue<ServiceJob> pendingQueue, Map<String, Stack<ServiceJob>> historyMap) {
        try {
            try (ObjectOutputStream uOut = new ObjectOutputStream(new FileOutputStream(USER_DB_FILE))) {
                uOut.writeObject(userTable);
            }
            try (ObjectOutputStream qOut = new ObjectOutputStream(new FileOutputStream(PENDING_JOBS_FILE))) {
                qOut.writeObject(new LinkedList<>(pendingQueue));
            }
            try (ObjectOutputStream hOut = new ObjectOutputStream(new FileOutputStream(HISTORY_DB_FILE))) {
                hOut.writeObject(historyMap);
            }
        } catch (IOException e) {
            System.err.println("Database sync error: " + e.getMessage());
        }
    }

    public static CustomHashTable loadUsers() {
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(USER_DB_FILE))) {
            return (CustomHashTable) in.readObject();
        } catch (Exception e) {
            return new CustomHashTable(101); // 101 prime buckets for low collision
        }
    }

    @SuppressWarnings("unchecked")
    public static Queue<ServiceJob> loadPendingQueue() {
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(PENDING_JOBS_FILE))) {
            LinkedList<ServiceJob> list = (LinkedList<ServiceJob>) in.readObject();
            return new LinkedList<>(list);
        } catch (Exception e) {
            return new LinkedList<>();
        }
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Stack<ServiceJob>> loadHistory() {
        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(HISTORY_DB_FILE))) {
            return (Map<String, Stack<ServiceJob>>) in.readObject();
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
}
