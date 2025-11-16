# Sokoni API Documentation

This document outlines the API endpoints used by the Sokoni frontend application. It details the request structure, expected data, and the corresponding backend logic required to support the client.

**Base URL:** All endpoints are relative to the main server URL (e.g., `http://localhost:8000`).

---

## 1. Authentication

### 1.1. Refresh Token

-   **Endpoint:** `/refresh_token`
-   **Method:** `POST`
-   **Description:** Obtains a new `access_token` using a valid `refresh_token`.
-   **Request Body:**
    ```json
    {
      "___refresh_token": "string"
    }
    ```
-   **Server Logic:**
    1.  Verify the provided `___refresh_token`.
    2.  If valid, generate a new `___access_token`.
    3.  Optionally, issue a new `___refresh_token` to extend the session.
    4.  Return the new tokens.
-   **Success Response (200 OK):**
    ```json
    {
      "___access_token": "new_access_token_string",
      "___refresh_token": "optional_new_refresh_token_string"
    }
    ```
-   **Error Response (401 Unauthorized):**
    ```json
    {
      "detail": "Invalid or expired refresh token"
    }
    ```

---

## 2. User Profile & Data

### 2.1. Get User Profile

-   **Endpoint:** `/get_user_profile`
-   **Method:** `POST`
-   **Description:** Retrieves the public profile information for a given user ID.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string"
    }
    ```
-   **Server Logic:**
    1.  Find the user by the provided `id`.
    2.  Return a structured object containing the user's profile data, including their locations and categories.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "data": {
        "id": "user_id_string",
        "username": "string",
        "name": "string",
        "full_name": "string",
        "profile_pic": "url_string",
        "verification": "string (e.g., 'gold', 'blue', 'null')",
        "bio": "string",
        "locations": [
          {
            "address": "string",
            "coordinates": ["latitude", "longitude"]
          }
        ],
        "categories": ["category1", "category2"]
      }
    }
    ```

### 2.2. Update User Profile

-   **Endpoint:** `/update_user`
-   **Method:** `POST`
-   **Description:** Updates a user's profile information. Can handle partial updates.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string",
      "data": {
        "name": "optional_string",
        "username": "optional_string",
        "profile_pic": "optional_url_string",
        "bio": "optional_string"
      }
    }
    ```
-   **Server Logic:**
    1.  Authenticate the request to ensure the user is updating their own profile.
    2.  Find the user by `id`.
    3.  Update the fields provided in the `data` object.
    4.  Return a success message.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Profile updated successfully"
    }
    ```

### 2.3. Get Usernames

-   **Endpoint:** `/get_usernames`
-   **Method:** `POST`
-   **Description:** Retrieves a user's own data and a list of all other usernames (for validation purposes).
-   **Request Body:**
    ```json
    {
      "id": "user_id_string"
    }
    ```
-   **Server Logic:**
    1.  Fetch the user's own profile data.
    2.  Fetch a list of all usernames from the database, excluding the current user's.
    3.  Return both in a structured response.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "user": {
        "id": "user_id_string",
        "name": "string",
        "full_name": "string",
        "username": "string",
        "profile_pic": "url_string"
      },
      "usernames": ["username1", "username2", "..."]
    }
    ```

### 2.4. Follow/Unfollow User

-   **Endpoint:** `/follow_user`
-   **Method:** `POST`
-   **Description:** Toggles the follow state between two users.
-   **Request Body:**
    ```json
    {
      "user_id": "follower_id_string",
      "target_id": "followed_id_string"
    }
    ```
-   **Server Logic:**
    1.  Check if a follow relationship exists between `user_id` and `target_id`.
    2.  If it exists, remove it (unfollow).
    3.  If it does not exist, create it (follow).
    4.  Return the new follow state.
-   **Success Response (200 OK):**
    ```json
    {
      "follow_state": "followed" // or "unfollowed"
    }
    ```

---

## 3. Products & Inventory

### 3.1. Get Products (Feed)

-   **Endpoint:** `/products/get_products`
-   **Method:** `POST`
-   **Description:** Fetches a paginated list of products for the main feed or explore page.
-   **Request Body:**
    ```json
    {
      "skip": 0,
      "limit": 100
    }
    ```
-   **Server Logic:**
    1.  Query the database for products, using `skip` and `limit` for pagination.
    2.  For each product, join with the host (user) data to include `host.username`, `host.profile_pic`, etc.
    3.  Return the list of products.
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "product_id_string",
        "host_id": "user_id_string",
        "host": {
          "username": "string",
          "profile_pic": "url_string",
          "verification": "string",
          "address": "string"
        },
        "created_at": "datetime_string",
        "title": "string",
        "price": "number",
        "description": "string",
        "images": ["url1", "url2"],
        "attributes": [
          {
            "name": "string",
            "values": ["value1", "value2"]
          }
        ]
      }
    ]
    ```

### 3.2. Get Inventory Products

-   **Endpoint:** `/get_inventory_products`
-   **Method:** `POST`
-   **Description:** Fetches all products belonging to the currently authenticated user.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string"
    }
    ```
-   **Server Logic:**
    1.  Find all products where `host_id` matches the provided `id`.
    2.  Return the list of products.
-   **Success Response (200 OK):** (Same format as `/products/get_products`)

---

## 4. Stories

### 4.1. Post a Story

-   **Endpoint:** `/post_story`
-   **Method:** `POST`
-   **Description:** Creates a new story for the user. This is typically called after a file upload.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string",
      "data": {
        "story_url": "url_to_uploaded_media",
        "post_date": "datetime_string",
        "caption": "string"
      }
    }
    ```
-   **Server Logic:**
    1.  Authenticate the user.
    2.  Add the story data to the user's story list in the database.
    3.  Return a success confirmation.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Story posted"
    }
    ```

### 4.2. Get Stories

-   **Endpoint:** `/get_story`
-   **Method:** `POST`
-   **Description:** Fetches stories from the user and their followed accounts.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string"
    }
    ```
-   **Server Logic:**
    1.  Find the user and the list of users they follow.
    2.  Aggregate all recent (e.g., last 24 hours) stories from these users.
    3.  Return a list of story objects, grouped by user.
-   **Success Response (200 OK):**
    ```json
    [
      {
        "user_id": "user_id_string",
        "profile_pic": "url_string",
        "story_list": [
          {
            "story_url": "url_string",
            "post_date": "datetime_string",
            "caption": "string"
          }
        ]
      }
    ]
    ```

---

## 5. Messaging & Chats

### 5.1. Get Last Conversations

-   **Endpoint:** `/last_conversation`
-   **Method:** `POST`
-   **Description:** Retrieves a list of the most recent conversations for the user.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string"
    }
    ```
-   **Server Logic:**
    1.  Query the database for all conversations involving the user.
    2.  For each conversation, get the last message, timestamp, and the other participant's details.
    3.  Return a list of conversation summaries.
-   **Success Response (200 OK):**
    ```json
    [
      {
        "sender_id": "other_user_id",
        "name": "Other User's Name",
        "img": "url_to_profile_pic",
        "time": "time_string",
        "message": "last_message_content"
      }
    ]
    ```

### 5.2. Get a Specific Conversation

-   **Endpoint:** `/get_conversation`
-   **Method:** `POST`
-   **Description:** Fetches the full message history between the user and a target user.
-   **Request Body:**
    ```json
    {
      "id": "current_user_id",
      "target_id": "other_user_id"
    }
    ```
-   **Server Logic:**
    1.  Retrieve all messages where the sender/receiver pair matches the two IDs.
    2.  Order the messages by timestamp.
    3.  Return the list of messages.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "messages": [
        {
          "sender": "user_id",
          "msg_content": "string",
          "msg_type": "text" | "image" | "link",
          "sent_at": "datetime_string"
        }
      ]
    }
    ```

### 5.3. Send a Message

-   **Endpoint:** `/send_message`
-   **Method:** `POST`
-   **Description:** Sends a message from one user to another.
-   **Request Body:**
    ```json
    {
      "from": "sender_id",
      "to": "receiver_id",
      "type": "text" | "image" | "link",
      "content": "message_content_or_url"
    }
    ```
-   **Server Logic:**
    1.  Save the message to the database, linking it to the sender and receiver.
    2.  Optionally, push a real-time notification to the receiver via WebSocket.
    3.  Return a success confirmation.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success"
    }
    ```

### 5.4. Online Status (WebSocket)

-   **Endpoint:** `/online_status`
-   **Protocol:** WebSocket (`ws://` or `wss://`)
-   **Description:** Manages a user's online presence.
-   **Client Action:**
    1.  On connection, the client sends its `user_id` string.
-   **Server Logic:**
    1.  On receiving a `user_id`, mark that user as "online" in a presence system (e.g., Redis or in-memory cache).
    2.  On socket close, mark the user as "offline".
    3.  The server can broadcast presence updates to connected clients.

---

## 6. Orders & Checkout

### 6.1. Get User's Orders

-   **Endpoint:** `/get_orders`
-   **Method:** `POST`
-   **Description:** Fetches a list of orders placed by the user.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string"
    }
    ```
-   **Server Logic:**
    1.  Find all orders where the `client_id` matches the user's `id`.
    2.  For each order, populate the product details and the seller's (host) information.
    3.  Return the list of orders.
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "order_id",
        "created_at": "datetime_string",
        "delivered": "boolean",
        "ready": "boolean",
        "host": { "username": "string", "profile_pic": "url" },
        "products": [
          {
            "title": "string",
            "thumbnail": "url",
            "amount": "number",
            "attributes": {}
          }
        ]
      }
    ]
    ```

### 6.2. Get Orders for a Seller (Client Orders)

-   **Endpoint:** `/get_client_orders`
-   **Method:** `POST`
-   **Description:** Fetches a list of orders placed with the user (as a seller).
-   **Request Body:**
    ```json
    {
      "id": "seller_user_id"
    }
    ```
-   **Server Logic:**
    1.  Find all orders where the `host_id` matches the seller's `id`.
    2.  Populate the details of the buyer (client).
    3.  Return the list of orders.
-   **Success Response (200 OK):** (Similar structure to `/get_orders`, but with `client` data instead of `host`)

### 6.3. Mark Order as Ready

-   **Endpoint:** `/mark_order_ready`
-   **Method:** `POST`
-   **Description:** Allows a seller to mark an order as ready for pickup/delivery.
-   **Request Body:**
    ```json
    {
      "id": "order_id_string"
    }
    ```
-   **Server Logic:**
    1.  Find the order by its `id`.
    2.  Update its status to `ready = true`.
    3.  Return a success confirmation.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success"
    }
    ```

### 6.4. Get Checkout Data

-   **Endpoint:** `/checkout_data`
-   **Method:** `POST`
-   **Description:** Calculates totals and delivery fees for a given cart and location.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string",
      "data": [
        // Cart items array
      ],
      "location_index": 0
    }
    ```
-   **Server Logic:**
    1.  Calculate the subtotal of all items in the `data` (cart).
    2.  Fetch the user's saved locations.
    3.  Calculate the distance and delivery cost for each location.
    4.  Return the totals and distance-based costs.
-   **Success Response (200 OK):**
    ```json
    {
      "total": 150000, // Subtotal
      "distances": [5.2, 10.1] // Distances in km for each saved location
    }
    ```

### 6.5. Confirm Checkout & Initiate Payment

-   **Endpoint:** `/checkout_confirm`
-   **Method:** `POST`
-   **Description:** Confirms the order and initiates a payment request with a third-party provider (e.g., ClickPesa).
-   **Request Body:**
    ```json
    {
      "id": "user_id_string",
      "data": [
        // Cart items array
      ],
      "phone": "255712345678",
      "location_index": 0
    }
    ```
-   **Server Logic:**
    1.  Validate the cart data and calculate the final total including delivery.
    2.  Make a request to the payment gateway's API with the phone number and total amount.
    3.  Return the transaction details from the payment gateway.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "order": "payment_gateway_order_id",
      "token": "payment_gateway_auth_token"
    }
    ```

### 6.6. Place Order (Post-Payment)

-   **Endpoint:** `/place_order`
-   **Method:** `POST`
-   **Description:** Creates the official order in the database after a payment has been successfully verified.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string",
      "order_ref": "payment_gateway_order_id",
      "token": "payment_gateway_auth_token",
      "cart": [
        // Cart items array
      ],
      "location_index": 0
    }
    ```
-   **Server Logic:**
    1.  Create a new order record in the database with all the cart items, user details, and delivery information.
    2.  Associate the `order_ref` with this new order for tracking.
    3.  Return a final success message.
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success",
      "message": "Order placed successfully"
    }
    ```

---

## 7. User Locations

### 7.1. Get User Locations

-   **Endpoint:** `/get_user_locations`
-   **Method:** `POST`
-   **Description:** Retrieves all saved addresses for a user.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    [
      {
        "title": "Home",
        "address": "123 Main St, Anytown, USA",
        "coordinates": [lat, lon]
      }
    ]
    ```

### 7.2. Add User Location

-   **Endpoint:** `/add_user_location`
-   **Method:** `POST`
-   **Description:** Adds a new address to the user's profile.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string",
      "location": {
        "title": "Work",
        "address": "456 Business Ave, Anytown, USA",
        "coordinates": [lat, lon]
      }
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success"
    }
    ```

### 7.3. Delete User Location

-   **Endpoint:** `/delete_user_location`
-   **Method:** `POST`
-   **Description:** Deletes a saved address from the user's profile.
-   **Request Body:**
    ```json
    {
      "id": "user_id_string",
      "location": {
        // The full location object to be deleted
        "title": "Work",
        "address": "456 Business Ave, Anytown, USA",
        "coordinates": [lat, lon]
      }
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "status": "success"
    }
    ```

---

## 8. File Uploads

### 8.1. Upload File

-   **Endpoint:** `/upload`
-   **Method:** `POST`
-   **Description:** A general-purpose endpoint for uploading files (profile pictures, story media, etc.).
-   **Request Body:** `FormData` containing the file.
    -   `key`: "file"
    -   `value`: The file blob.
-   **Server Logic:**
    1.  Receive the multipart/form-data.
    2.  Generate a unique filename.
    3.  Save the file to a designated uploads directory (e.g., `/sokoni_uploads/`).
    4.  Return the generated filename.
-   **Success Response (200 OK):**
    ```json
    {
      "filename": "generated_unique_filename.jpg"
    }
    ```
-   **Static File Serving:** The server must be configured to statically serve files from the `/sokoni_uploads/` directory.
