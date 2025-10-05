import { ref, computed } from "vue";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase.js";
import { useAuth } from "./useAuth.js";

export function useProducts() {
  const { user, userProfile } = useAuth();
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const adminUserId = ref(null);

  // Categorías disponibles
  const categories = [
    "Computadoras",
    "Periféricos",
    "Impresoras",
    "Monitores",
    "Accesorios",
    "Software",
    "Hardware",
    "Networking",
    "Otros",
  ];

  // Estados de producto
  const statuses = ["Activo", "Inactivo", "Agotado", "Descontinuado"];

  const findAdminUserId = async () => {
    if (!user.value?.uid || !userProfile.value?.projectCode) {
      return null
    }

    try {
      // Si el usuario actual es admin, usar su UID
      if (userProfile.value.role === 'admin') {
        return user.value.uid
      }

      // Si es operario, buscar el admin por projectCode
      const usersRef = collection(db, 'users')
      const q = query(
        usersRef, 
        where('projectCode', '==', userProfile.value.projectCode),
        where('role', '==', 'admin') // ✅ SIMPLIFICADO: Solo buscar 'admin'
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id
      }

      return null
    } catch (err) {
      console.error('Error buscando admin:', err)
      return null
    }
  }

  // Referencia a la colección de productos
  const getProductsCollection = async () => {
    if (!user.value?.uid) {
      throw new Error("Usuario no autenticado");
    }

    // Encontrar el admin del proyecto
    if (!adminUserId.value) {
      adminUserId.value = await findAdminUserId();
    }

    if (!adminUserId.value) {
      throw new Error("No se encontró el administrador del proyecto");
    }

    return collection(db, `users/${adminUserId.value}/products`);
  };

  // Cargar productos del usuario
  const loadProducts = async () => {
    if (!user.value?.uid) {
      error.value = "Usuario no autenticado";
      return;
    }

    try {
      loading.value = true;
      error.value = null;

      const productsRef = await getProductsCollection();
      const q = query(productsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      products.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error("Error cargando productos:", err);
      error.value = "Error al cargar productos: " + err.message;
    } finally {
      loading.value = false;
    }
  };

  // Escuchar cambios en tiempo real
  const subscribeToProducts = async () => {
    if (!user.value?.uid) return null;

    try {
      const productsRef = await getProductsCollection();
      const q = query(productsRef, orderBy("createdAt", "desc"));

      return onSnapshot(
        q,
        (querySnapshot) => {
          products.value = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        },
        (err) => {
          console.error("Error en suscripción:", err);
          error.value = "Error al sincronizar productos: " + err.message;
        }
      );
    } catch (err) {
      console.error("Error suscribiéndose a productos:", err);
      return null;
    }
  };

  // Agregar producto
  const addProduct = async (productData) => {
    if (!user.value?.uid) {
      throw new Error("Usuario no autenticado");
    }

    try {
      loading.value = true;
      error.value = null;

      const productsRef = await getProductsCollection();

      // Usar el UID del admin como userId
      const newProduct = {
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: adminUserId.value, // CAMBIADO: usar UID del admin
        addedBy: user.value.uid, // NUEVO: guardar quién agregó el producto
      };

      const docRef = await addDoc(productsRef, newProduct);
      return docRef.id;
    } catch (err) {
      console.error("Error agregando producto:", err);
      error.value = "Error al agregar producto: " + err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Actualizar producto
  const updateProduct = async (productId, productData) => {
    if (!user.value?.uid) {
      throw new Error("Usuario no autenticado");
    }

    try {
      loading.value = true;
      error.value = null;

      // Usar el UID del admin
      if (!adminUserId.value) {
        adminUserId.value = await findAdminUserId();
      }

      const productRef = doc(
        db,
        `users/${adminUserId.value}/products/${productId}`
      );
      const updatedProduct = {
        ...productData,
        updatedAt: new Date(),
        updatedBy: user.value.uid, // NUEVO: guardar quién actualizó
      };

      await updateDoc(productRef, updatedProduct);
    } catch (err) {
      console.error("Error actualizando producto:", err);
      error.value = "Error al actualizar producto: " + err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Eliminar producto
  const deleteProduct = async (productId) => {
    if (!user.value?.uid) {
      throw new Error("Usuario no autenticado");
    }

    try {
      loading.value = true;
      error.value = null;

      // Usar el UID del admin
      if (!adminUserId.value) {
        adminUserId.value = await findAdminUserId();
      }

      const productRef = doc(
        db,
        `users/${adminUserId.value}/products/${productId}`
      );
      await deleteDoc(productRef);
    } catch (err) {
      console.error("Error eliminando producto:", err);
      error.value = "Error al eliminar producto: " + err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Computed para estadísticas
  const stats = computed(() => {
    const totalProducts = products.value.length;
    const lowStock = products.value.filter(
      (p) => p.stock <= (p.minStock || 5)
    ).length;
    const outOfStock = products.value.filter((p) => p.stock === 0).length;
    const totalValue = products.value.reduce(
      (sum, p) => sum + p.price * p.stock,
      0
    );
    const activeProducts = products.value.filter(
      (p) => p.status === "Activo"
    ).length;

    return {
      totalProducts,
      lowStock,
      outOfStock,
      totalValue,
      activeProducts,
    };
  });

  // Buscar productos
  const searchProducts = (searchTerm) => {
    if (!searchTerm.trim()) return products.value;

    const term = searchTerm.toLowerCase();
    return products.value.filter(
      (product) =>
        product.name?.toLowerCase().includes(term) ||
        product.code?.toLowerCase().includes(term) ||
        product.sku?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
    );
  };

  // Filtrar productos por categoría
  const filterByCategory = (category) => {
    if (!category) return products.value;
    return products.value.filter((product) => product.category === category);
  };

  // Filtrar productos por estado
  const filterByStatus = (status) => {
    if (!status) return products.value;
    return products.value.filter((product) => product.status === status);
  };

  return {
    products,
    loading,
    error,
    categories,
    statuses,
    stats,
    loadProducts,
    subscribeToProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory,
    filterByStatus,
  };
}
