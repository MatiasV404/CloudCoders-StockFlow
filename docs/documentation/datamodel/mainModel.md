FIRESTORE DATABASE
│
└──users/ (Collection)
    │
    ├──{userId} (Document)
    │   │
    │   ├── uid: string
    │   ├── email: string
    │   ├── displayName: string | null
    │   ├── createdAt: Timestamp
    │   ├── updatedAt: Timestamp
    │   │
    │   └──products/ (Subcollection)
    │       │
    │       └──{productId} (Document)
    │           │
    │           ├── name: string
    │           ├── code: string
    │           ├── sku: string
    │           ├── description: string
    │           ├── category: string
    │           ├── status: string
    │           ├── stock: number
    │           ├── minStock: number (default: 5)
    │           ├── price: number
    │           ├── cost: number
    │           ├── userId: string (UID del propietario)
    │           ├── createdAt: Timestamp
    │           └── updatedAt: Timestamp