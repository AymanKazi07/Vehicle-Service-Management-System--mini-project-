package src;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.ArrayList;
import java.util.List;

public class CustomHashTable implements Serializable {
    private static final long serialVersionUID = 1L;

    static class HashNode implements Serializable {
        private static final long serialVersionUID = 1L;
        String key; // Vehicle Number
        User value;

        HashNode(String key, User value) {
            this.key = key;
            this.value = value;
        }
    }

    private LinkedList<HashNode>[] buckets;
    private int capacity;
    private int size;

    @SuppressWarnings("unchecked")
    public CustomHashTable(int capacity) {
        this.capacity = capacity;
        this.buckets = new LinkedList[capacity];
        for (int i = 0; i < capacity; i++) {
            buckets[i] = new LinkedList<>();
        }
        this.size = 0;
    }

    private int getBucketIndex(String key) {
        int hashCode = key.hashCode();
        return Math.abs(hashCode) % capacity;
    }

    public void put(String key, User value) {
        int bucketIndex = getBucketIndex(key);
        LinkedList<HashNode> chain = buckets[bucketIndex];
        for (HashNode node : chain) {
            if (node.key.equalsIgnoreCase(key)) {
                node.value = value;
                return;
            }
        }
        chain.add(new HashNode(key, value));
        size++;
    }

    public User get(String key) {
        int bucketIndex = getBucketIndex(key);
        LinkedList<HashNode> chain = buckets[bucketIndex];
        for (HashNode node : chain) {
            if (node.key.equalsIgnoreCase(key)) {
                return node.value;
            }
        }
        return null;
    }

    public boolean containsKey(String key) {
        return get(key) != null;
    }

    public int getSize() {
        return size;
    }

    public List<User> getAllUsers() {
        List<User> list = new ArrayList<>();
        for (int i = 0; i < capacity; i++) {
            for (HashNode node : buckets[i]) {
                list.add(node.value);
            }
        }
        return list;
    }
}
