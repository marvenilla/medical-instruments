import { useState, useEffect } from 'react';
import './ProductInventory.css';
import PageNav from '../components/PageNav';
import { supabase } from '../supabase';

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', quantity: '', price: '', uom: 'Each', category: 'Finished Good', storeRoom: '', location: '', lotNumber: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterId, setFilterId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from the database when the component mounts
    const fetchProducts = async () => {
      const fetchResult = await supabase
        .from('Product')
        .select('*');

      if (fetchResult.error) {
        setError(fetchResult.error.message);
      } else {
        setProducts(fetchResult.data);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleAddProduct = async () => {
    const userResult = await supabase.auth.getUser();
    if (userResult.error) {
      setError(userResult.error.message);
      return;
    }

    const newProduct = {
      ...currentProduct,
      user_id: userResult.data.user.id,
    };

    const insertResult = await supabase
      .from("Product")
      .insert([
        {
          user_id: newProduct.user_id,
          name: newProduct.name,
          quantity: newProduct.quantity,
          price: newProduct.price,
          unit_of_measure: newProduct.uom,
          category: newProduct.category,
          store_room: newProduct.storeRoom,
          location: newProduct.location,
          lot_number: newProduct.lotNumber,
        }
      ]);

    if (insertResult.error) {
      setError(insertResult.error.message);
      return;
    }

    // Fetch the updated list of products from the database
    const fetchResult = await supabase
      .from('Product')
      .select('*');

    if (fetchResult.error) {
      setError(fetchResult.error.message);
      return;
    }

    setProducts(fetchResult.data);
    setCurrentProduct({ id: null, name: '', quantity: '', price: '', uom: 'Each', category: 'Finished Good', storeRoom: '', location: '', lotNumber: '' });
  };

  const handleSaveProduct = () => {
    const updatedProducts = products.map((product, index) =>
      index === editIndex ? currentProduct : product
    );
    setProducts(updatedProducts);
    setShowModal(false);
    setCurrentProduct({ id: null, name: '', quantity: '', price: '', uom: 'Each', category: 'Finished Good', storeRoom: '', location: '', lotNumber: '' });
    setEditIndex(null);
  };

  const handleEditProduct = (index) => {
    setCurrentProduct(products[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const filteredProducts = products.filter(product => {
    return (filterCategory === '' || product.category === filterCategory) &&
           (filterId === '' || product.id === parseInt(filterId));
  });

  return (
    <div className="container">
      <PageNav />
      <div className="header">
        <h1>Inventory</h1>
      </div>

      {error && <div className="error">{error}</div>} {/* Display error message */}

      <div className="form-container">
        <div className="form-group">
          <label className='product-label'>Name</label>
          <input className='product-input'
            type="text"
            name="name"
            value={currentProduct.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Quantity</label>
          <input className='product-input'
            type="number"
            name="quantity"
            value={currentProduct.quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Price</label>
          <input className='product-input'
            type="number"
            name="price"
            value={currentProduct.price}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Unit of Measure</label>
          <select className='product-input'
            name="uom"
            value={currentProduct.uom}
            onChange={handleInputChange}
          >
            <option value="Each">Each</option>
            <option value="Box">Box</option>
            <option value="Case">Case</option>
          </select>
        </div>

        <div className="form-group">
          <label className='product-label'>Category</label>
          <select className='product-input'
            name="category"
            value={currentProduct.category}
            onChange={handleInputChange}
          >
            <option value="Finished Good">Finished Good</option>
            <option value="Raw Material">Raw Material</option>
          </select>
        </div>

        <div className="form-group">
          <label className='product-label'>Store Room</label>
          <input className='product-input'
            type="text"
            name="storeRoom"
            value={currentProduct.storeRoom}
            onChange={handleInputChange}
            placeholder="Enter store room"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Location</label>
          <input className='product-input'
            type="text"
            name="location"
            value={currentProduct.location}
            onChange={handleInputChange}
            placeholder="Enter location"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Lot Number</label>
          <input className='product-input'
            type="text"
            name="lotNumber"
            value={currentProduct.lotNumber}
            onChange={handleInputChange}
            placeholder="Enter lot number"
          />
        </div>

        <button onClick={handleAddProduct}>Add Product</button>
      </div>

      <div className="list-container">
        <h2>Product List</h2>

        <div className="filters">
          <label>Filter by Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">All</option>
            <option value="Finished Good">Finished Good</option>
            <option value="Raw Material">Raw Material</option>
          </select>

          <label>Filter by ID:</label>
          <input
            type="text"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            placeholder="Enter product ID"
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Unit of Measure</th>
              <th>Category</th>
              <th>Store Room</th>
              <th>Location</th>
              <th>Lot Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.unit_of_measure}</td>
                <td>{product.category}</td>
                <td>{product.store_room}</td>
                <td>{product.location}</td>
                <td>{product.lot_number}</td>
                <td>
                  <button onClick={() => handleEditProduct(index)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`modal ${showModal ? 'show' : ''}`}>
        <div className="modal-header">
          <h4>Edit Product</h4>
          <span className="close" onClick={() => setShowModal(false)}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={currentProduct.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={currentProduct.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={currentProduct.price}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
          </div>

          <div className="form-group">
            <label>Unit of Measure</label>
            <select
              name="uom"
              value={currentProduct.uom}
              onChange={handleInputChange}
            >
              <option value="Each">Each</option>
              <option value="Box">Box</option>
              <option value="Case">Case</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={currentProduct.category}
              onChange={handleInputChange}
            >
              <option value="Finished Good">Finished Good</option>
              <option value="Raw Material">Raw Material</option>
            </select>
          </div>

          <div className="form-group">
            <label>Store Room</label>
            <input
              type="text"
              name="storeRoom"
              value={currentProduct.storeRoom}
              onChange={handleInputChange}
              placeholder="Enter store room"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={currentProduct.location}
              onChange={handleInputChange}
              placeholder="Enter location"
            />
          </div>

          <div className="form-group">
            <label>Lot Number</label>
            <input
              type="text"
              name="lotNumber"
              value={currentProduct.lotNumber}
              onChange={handleInputChange}
              placeholder="Enter lot number"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={() => setShowModal(false)}>Close</button>
          <button onClick={handleSaveProduct}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ProductInventory;
