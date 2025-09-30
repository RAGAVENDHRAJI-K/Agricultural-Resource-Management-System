#include <stdio.h> #include <stdlib.h> #include <pthread.h>

#define SIZE 10

int array[SIZE] = {38, 27, 43, 3, 9, 82, 10, 15, 28, 11};


int L[n1], R[n2];


for (i = 0; i < n1; i++)
    L[i] = array[left + i];
for (j = 0; j < n2; j++)
    R[j] = array[mid + 1 + j];

// Merge the temp arrays back into array[left..right]
i = 0;
j = 0;
k = left;
while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
        array[k] = L[i];
        i++;
    } else {
        array[k] = R[j];
        j++;
    }
    k++;
}

// Copy the remaining elements
while (i < n1) {
    array[k] = L[i];
    i++;
    k++;
}
while (j < n2) {
    array[k] = R[j];
    j++;
    k++;
}

}

// Recursive function for merge sort void* merge_sort(void* arg) { Range* range = (Range*) arg; int left = range->left; int right = range->right;

if (left < right) {
    int mid = left + (right - left) / 2;

    // Divide the task into two halves
    Range left_range = {left, mid};
    Range right_range = {mid + 1, right};

    // Create threads for sorting each half
    pthread_t left_thread, right_thread;
    pthread_create(&left_thread, NULL, merge_sort, &left_range);
    pthread_create(&right_thread, NULL, merge_sort, &right_range);

    // Wait for both threads to finish
    pthread_join(left_thread, NULL);
    pthread_join(right_thread, NULL);

    // Merge the sorted halves
    merge(left, mid, right);
}
pthread_exit(0);

}

int main() { printf("Original array: "); for (int i = 0; i < SIZE; i++) printf("%d ", array[i]); printf("\n");

// Setting up the full range for the first call
Range full_range = {0, SIZE - 1};
pthread_t main_thread;

// Start the merge sort using multithreading
pthread_create(&main_thread, NULL, merge_sort, &full_range);
pthread_join(main_thread, NULL);

// Display the sorted array
printf("Sorted array: ");
for (int i = 0; i < SIZE; i++)
    printf("%d ", array[i]);
printf("\n");

return 0;

}
