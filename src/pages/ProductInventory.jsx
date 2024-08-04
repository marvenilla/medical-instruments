import { useState, useEffect } from 'react';
import './ProductInventory.css';
import PageNav from '../components/PageNav';
import { supabase } from '../supabase';

const ProductInventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    quantity: '',
    price: '',
    sku: '',
    uom: 'Each',
    category: 'Finished Good',
    family: 'Family A',
    subFamily: 'Subfamily A',
    subjectToShelfLife: 'Yes',
    store_room: '',
    location: '',
    lot_number: ''
  });
  const [filterCategory, setFilterCategory] = useState('');
  const [filterId, setFilterId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
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
          sku: newProduct.sku,
          unit_of_measure: newProduct.uom,
          category: newProduct.category,
          family: newProduct.family,
          sub_family: newProduct.subFamily,
          subject_to_shelf_life: newProduct.subjectToShelfLife,
          store_room: newProduct.store_room,
          location: newProduct.location,
          lot_number: newProduct.lot_number,
        }
      ]);

    if (insertResult.error) {
      setError(insertResult.error.message);
      return;
    }

    const fetchResult = await supabase
      .from('Product')
      .select('*');

    if (fetchResult.error) {
      setError(fetchResult.error.message);
      return;
    }

    setProducts(fetchResult.data);
    setCurrentProduct({
      id: null,
      name: '',
      quantity: '',
      price: '',
      sku: '',
      uom: 'Each',
      category: 'Finished Good',
      family: 'Family A',
      subFamily: 'Subfamily A',
      subjectToShelfLife: 'Yes',
      store_room: '',
      location: '',
      lot_number: ''
    });
  };

  const handleSaveProduct = async () => {
    const updateResult = await supabase
      .from('Product')
      .update({
        name: currentProduct.name,
        quantity: currentProduct.quantity,
        price: currentProduct.price,
        sku: currentProduct.sku,
        unit_of_measure: currentProduct.uom,
        category: currentProduct.category,
        family: currentProduct.family,
        sub_family: currentProduct.subFamily,
        subject_to_shelf_life: currentProduct.subjectToShelfLife,
        store_room: currentProduct.store_room,
        location: currentProduct.location,
        lot_number: currentProduct.lot_number,
      })
      .eq('id', currentProduct.id);

    if (updateResult.error) {
      setError(updateResult.error.message);
      return;
    }

    const fetchResult = await supabase
      .from('Product')
      .select('*');

    if (fetchResult.error) {
      setError(fetchResult.error.message);
      return;
    }

    setProducts(fetchResult.data);
    setShowModal(false);
    setCurrentProduct({
      id: null,
      name: '',
      quantity: '',
      price: '',
      sku: '',
      uom: 'Each',
      category: 'Finished Good',
      family: 'Family A',
      subFamily: 'Subfamily A',
      subjectToShelfLife: 'Yes',
      store_room: '',
      location: '',
      lot_number: ''
    });
  };

  const handleEditProduct = (id) => {
    const productToEdit = products.find(product => product.id === id);
    setCurrentProduct(productToEdit);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    const deleteResult = await supabase
      .from('Product')
      .delete()
      .eq('id', id);

    if (deleteResult.error) {
      setError(deleteResult.error.message);
      return;
    }

    const fetchResult = await supabase
      .from('Product')
      .select('*');

    if (fetchResult.error) {
      setError(fetchResult.error.message);
      return;
    }

    setProducts(fetchResult.data);
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
            value={currentProduct.name || ''}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Quantity</label>
          <input className='product-input'
            type="number"
            name="quantity"
            value={currentProduct.quantity || ''}
            onChange={handleInputChange}
            placeholder="Enter quantity"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Price</label>
          <input className='product-input'
            type="number"
            name="price"
            value={currentProduct.price || ''}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>SKU</label>
          <input className='product-input'
            type="text"
            name="sku"
            value={currentProduct.sku || ''}
            onChange={handleInputChange}
            placeholder="Enter SKU"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Unit of Measure</label>
          <select className='product-input'
            name="uom"
            value={currentProduct.uom || 'Each'}
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
            value={currentProduct.category || 'Finished Good'}
            onChange={handleInputChange}
          >
            <option value="Finished Good">Finished Good</option>
            <option value="Raw Material">Raw Material</option>
          </select>
        </div>

        <div className="form-group">
          <label className='product-label'>Family</label>
          <select className='product-input'
            name="family"
            value={currentProduct.family || 'Family A'}
            onChange={handleInputChange}
          >
            <option value="Family A">Family A</option>
            <option value="Family B">Family B</option>
            <option value="Family C">Family C</option>
            <option value="Family D">Family D</option>
            <option value="Family E">Family E</option>
          </select>
        </div>

        <div className="form-group">
          <label className='product-label'>Subfamily</label>
          <select className='product-input'
            name="subFamily"
            value={currentProduct.subFamily || 'Subfamily A'}
            onChange={handleInputChange}
          >
            <option value="Subfamily A">Subfamily A</option>
            <option value="Subfamily B">Subfamily B</option>
            <option value="Subfamily C">Subfamily C</option>
            <option value="Subfamily D">Subfamily D</option>
            <option value="Subfamily E">Subfamily E</option>
          </select>
        </div>

        <div className="form-group">
          <label className='product-label'>Subject To Shelf Life?</label>
          <select className='product-input'
            name="subjectToShelfLife"
            value={currentProduct.subjectToShelfLife || 'Yes'}
            onChange={handleInputChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group">
          <label className='product-label'>Store Room</label>
          <input className='product-input'
            type="text"
            name="store_room"
            value={currentProduct.store_room || ''}
            onChange={handleInputChange}
            placeholder="Enter store room"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Location</label>
          <input className='product-input'
            type="text"
            name="location"
            value={currentProduct.location || ''}
            onChange={handleInputChange}
            placeholder="Enter location"
          />
        </div>

        <div className="form-group">
          <label className='product-label'>Lot Number</label>
          <input className='product-input'
            type="text"
            name="lot_number"
            value={currentProduct.lot_number || ''}
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
              <th>SKU</th>
              <th>Unit of Measure</th>
              <th>Category</th>
              <th>Family</th>
              <th>Subfamily</th>
              <th>Subject To Shelf Life?</th>
              <th>Store Room</th>
              <th>Location</th>
              <th>Lot Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.sku}</td>
                <td>{product.unit_of_measure}</td>
                <td>{product.category}</td>
                <td>{product.family}</td>
                <td>{product.sub_family}</td>
                <td>{product.subject_to_shelf_life}</td>
                <td>{product.store_room}</td>
                <td>{product.location}</td>
                <td>{product.lot_number}</td>
                <td>
                  <button onClick={() => handleEditProduct(product.id)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
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
              value={currentProduct.name || ''}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={currentProduct.quantity || ''}
              onChange={handleInputChange}
              placeholder="Enter quantity"
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={currentProduct.price || ''}
              onChange={handleInputChange}
              placeholder="Enter price"
            />
          </div>

          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              value={currentProduct.sku || ''}
              onChange={handleInputChange}
              placeholder="Enter SKU"
            />
          </div>

          <div className="form-group">
            <label>Unit of Measure</label>
            <select
              name="uom"
              value={currentProduct.uom || 'Each'}
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
              value={currentProduct.category || 'Finished Good'}
              onChange={handleInputChange}
            >
              <option value="Finished Good">Finished Good</option>
              <option value="Raw Material">Raw Material</option>
            </select>
          </div>

          <div className="form-group">
            <label>Family</label>
            <select
              name="family"
              value={currentProduct.family || 'Family A'}
              onChange={handleInputChange}
            >
              <option value="Family A">Family A</option>
              <option value="Family B">Family B</option>
              <option value="Family C">Family C</option>
              <option value="Family D">Family D</option>
              <option value="Family E">Family E</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subfamily</label>
            <select
              name="subFamily"
              value={currentProduct.subFamily || 'Subfamily A'}
              onChange={handleInputChange}
            >
              <option value="Subfamily A">Subfamily A</option>
              <option value="Subfamily B">Subfamily B</option>
              <option value="Subfamily C">Subfamily C</option>
              <option value="Subfamily D">Subfamily D</option>
              <option value="Subfamily E">Subfamily E</option>
            </select>
          </div>

          <div className="form-group">
            <label>Subject To Shelf Life?</label>
            <select
              name="subjectToShelfLife"
              value={currentProduct.subjectToShelfLife || 'Yes'}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>Store Room</label>
            <input
              type="text"
              name="store_room"
              value={currentProduct.store_room || ''}
              onChange={handleInputChange}
              placeholder="Enter store room"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={currentProduct.location || ''}
              onChange={handleInputChange}
              placeholder="Enter location"
            />
          </div>

          <div className="form-group">
            <label>Lot Number</label>
            <input
              type="text"
              name="lot_number"
              value={currentProduct.lot_number || ''}
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
