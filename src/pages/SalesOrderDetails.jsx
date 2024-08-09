import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input, Dropdown } from "../components/layout";
import PageNav from "../components/PageNav";
import { daysBetween, formatDate } from "../helpers";
import { supabase } from "../supabase";
import { Modal, Button } from 'react-bootstrap';

const SalesOrderDetails = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [salesOrderData, setSalesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    product_name: "",
    sku: "",
    family: "",
    sub_family: "",
    subject_to_shelf_life: "",
    quantity: "",
    order_quantity: "",
    balance_due: "",
    price: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        console.log("Fetching data for sales order ID:", id);
        const { data, error } = await supabase.from("SalesOrder").select("*").eq("sales_id", id);
        if (error) {
          setError("An unexpected error has occurred");
          console.log("Supabase error:", error);
        } else if (data && data.length > 0) {
          const singleSalesOrder = data[0];
          console.log("Fetched sales order data:", singleSalesOrder);
          setSalesData(singleSalesOrder);

          // Set form field values
          Object.keys(singleSalesOrder).forEach((key) => {
            setValue(key, singleSalesOrder[key]);
          });
        } else {
          setError("No sales order found");
          console.log("No data found for the given ID");
        }
      } catch (error) {
        setError("Error fetching data from server");
        console.log("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSalesProducts = async () => {
      const { data, error } = await supabase.from("SalesProduct").select("*").eq("sales_id", id);
      if (error) {
        console.log("Error fetching sales products:", error.message);
      } else {
        setSelectedProducts(data);
      }
    };

    const fetchProducts = async () => {
      const fetchResult = await supabase.from("Product").select("*");
      if (fetchResult.error) {
        console.log("Error fetching products:", fetchResult.error.message);
      } else {
        setProducts(fetchResult.data);
      }
    };

    fetchSalesData();
    fetchSalesProducts();
    fetchProducts();
  }, [id, setValue]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });

    if (name === "product_name") {
      const matchingProducts = products.filter((p) => p.name.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(matchingProducts);

      const product = products.find((p) => p.name === value);
      if (product) {
        setCurrentProduct({
          ...currentProduct,
          product_name: value,
          sku: product.sku,
          family: product.family,
          sub_family: product.sub_family,
          subject_to_shelf_life: product.subject_to_shelf_life,
          quantity: product.quantity,
          order_quantity: currentProduct.order_quantity,
          balance_due: product.quantity - currentProduct.order_quantity,
          price: product.price,
        });
      } else {
        setCurrentProduct({
          ...currentProduct,
          product_name: value,
          sku: "",
          family: "",
          sub_family: "",
          subject_to_shelf_life: "",
          quantity: "",
          order_quantity: "",
          balance_due: "",
          price: "",
        });
      }
    }

    if (name === "order_quantity") {
      const product = products.find((p) => p.name === currentProduct.product_name);
      if (product) {
        const balanceDue = product.quantity - value;
        setCurrentProduct({ ...currentProduct, balance_due: balanceDue, order_quantity: value });

        // Update the order quantity in the selected products
        const updatedProducts = selectedProducts.map((p) =>
          p.product_name === currentProduct.product_name ? { ...p, order_quantity: value } : p
        );
        setSelectedProducts(updatedProducts);

        // Recalculate the total cost
        const newTotalCost = calculateTotalCost(updatedProducts);
        setSalesData((prevData) => ({ ...prevData, total_cost: newTotalCost }));
      }
    }
  };

  const handleSuggestionClick = (product) => {
    setCurrentProduct({
      ...currentProduct,
      product_name: product.name,
      sku: product.sku,
      family: product.family,
      sub_family: product.sub_family,
      subject_to_shelf_life: product.subject_to_shelf_life,
      quantity: product.quantity,
      order_quantity: currentProduct.order_quantity,
      balance_due: product.quantity - currentProduct.order_quantity,
      price: product.price,
    });
    setSuggestions([]);
  };

  const calculateTotalCost = (products) => {
    return products.reduce((acc, p) => acc + (p.price * p.order_quantity), 0);
  };

  const handleAddProduct = async () => {
    const product = products.find((p) => p.name === currentProduct.product_name);
    if (product) {
      const updatedProduct = {
        id: null,
        product_name: currentProduct.product_name,
        sku: product.sku,
        family: product.family,
        sub_family: product.sub_family,
        subject_to_shelf_life: product.subject_to_shelf_life,
        quantity: product.quantity,
        order_quantity: currentProduct.order_quantity,
        balance_due: currentProduct.balance_due,
        price: currentProduct.price,
      };
      const newSelectedProducts = [...selectedProducts, updatedProduct];
      setSelectedProducts(newSelectedProducts);

      const newTotalCost = calculateTotalCost(newSelectedProducts);
      setSalesData((prevData) => ({ ...prevData, total_cost: newTotalCost }));

      setCurrentProduct({
        id: null,
        product_name: "",
        sku: "",
        family: "",
        sub_family: "",
        subject_to_shelf_life: "",
        quantity: "",
        order_quantity: "",
        balance_due: "",
        price: "",
      });
    } else {
      console.log("Product not found");
    }
  };

  const handleEditProduct = (index) => {
    setEditIndex(index);
    const productToEdit = selectedProducts[index];
    setCurrentProduct({
      id: productToEdit.id,
      product_name: productToEdit.product_name,
      sku: productToEdit.sku,
      family: productToEdit.family,
      sub_family: productToEdit.sub_family,
      subject_to_shelf_life: productToEdit.subject_to_shelf_life,
      quantity: productToEdit.quantity,
      order_quantity: productToEdit.order_quantity || '',
      balance_due: productToEdit.balance_due || '',
      price: productToEdit.price || '',
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (index) => {
    const productToDelete = selectedProducts[index];
    if (productToDelete.id) {
      setDeletedProducts((prev) => [...prev, productToDelete.id]);
    }
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);

    const newTotalCost = calculateTotalCost(updatedProducts);
    setSalesData((prevData) => ({ ...prevData, total_cost: newTotalCost }));
  };

  const handleModalSave = () => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[editIndex] = {
      ...currentProduct,
      name: currentProduct.product_name,
    };
    setSelectedProducts(updatedProducts);

    const newTotalCost = calculateTotalCost(updatedProducts);
    setSalesData((prevData) => ({ ...prevData, total_cost: newTotalCost }));

    setShowModal(false);
    setCurrentProduct({
      id: null,
      product_name: "",
      sku: "",
      family: "",
      sub_family: "",
      subject_to_shelf_life: "",
      quantity: "",
      order_quantity: "",
      balance_due: "",
      price: "",
    });
    setEditIndex(null);
  };

  const handleSave = async (data) => {
    const orderedProducts = selectedProducts.map(product => product.product_name).join(', ');

    const sanitizedData = {
      ...data,
      order_date: data.order_date ? new Date(data.order_date).toISOString() : new Date().toISOString(),
      ship_date_1: data.ship_date_1 ? new Date(data.ship_date_1).toISOString() : null,
      ship_date_2: data.ship_date_2 ? new Date(data.ship_date_2).toISOString() : null,
      date_of_ship: data.date_of_ship ? new Date(data.date_of_ship).toISOString() : null,
      date_of_arrival: data.date_of_arrival ? new Date(data.date_of_arrival).toISOString() : null,
      total_cost: salesOrderData.total_cost || 0,
      ordered_products: orderedProducts || '',
      status: data.status || "Pending",
      currency: "CAD",
    };

    try {
      setUpdateLoading(true);
      const { data: salesOrderData, error: salesOrderError } = await supabase
        .from("SalesOrder")
        .update(sanitizedData)
        .eq("sales_id", id)
        .select();
      if (salesOrderError) throw salesOrderError;

      const salesOrderId = salesOrderData[0].sales_id;

      if (deletedProducts.length > 0) {
        const { error: deleteError } = await supabase
          .from("SalesProduct")
          .delete()
          .in("id", deletedProducts);
        if (deleteError) throw deleteError;
      }

      for (const product of selectedProducts) {
        if (product.id) {
          const { error: updateError } = await supabase
            .from("SalesProduct")
            .update({
              product_name: product.product_name,
              sku: product.sku,
              family: product.family,
              sub_family: product.sub_family,
              subject_to_shelf_life: product.subject_to_shelf_life,
              price: product.price,
              order_quantity: product.order_quantity,
              balance_due: product.balance_due,
            })
            .eq("id", product.id);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("SalesProduct")
            .insert({
              sales_id: salesOrderId,
              product_name: product.product_name,
              sku: product.sku,
              family: product.family,
              sub_family: product.sub_family,
              subject_to_shelf_life: product.subject_to_shelf_life,
              price: product.price,
              order_quantity: product.order_quantity,
              balance_due: product.balance_due,
            });
          if (insertError) throw insertError;
        }
      }

      alert("Sales order and products saved successfully");
      reset();
      setUpdateLoading(false);
      navigate("/sales");
    } catch (error) {
      alert("An unexpected error has occurred!");
      console.log("Error creating record in Supabase", error);
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    // Placeholder usage to avoid ESLint error
    if (deletedProducts.length > 0) {
      console.log("Deleted products:", deletedProducts);
    }
  }, [deletedProducts]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PageNav />
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <form className="mt-5 fs-4" onSubmit={handleSubmit(handleSave)}>
            <h2 style={{ fontWeight: "bold" }}>Sales order</h2>
            <Input label="Id" disabled value={salesOrderData.sales_id || ""} />
            <Input
              register={register}
              label="Client name"
              name="client"
              defaultValue=""
            />
            <hr className="hr my-4" />
            <h2 style={{ fontWeight: "bold" }}>Product</h2>
            <div className="form-group">
              <label className="product-label">Product name</label>
              <input
                className="product-input"
                type="text"
                name="product_name"
                value={currentProduct.product_name}
                onChange={handleInputChange}
              />
              {suggestions.length > 0 && (
                <ul>
                  {suggestions.map((product, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(product)}>
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Input
              label="SKU"
              name="sku"
              value={currentProduct.sku}
              disabled
            />
            <Input
              label="Family"
              name="family"
              value={currentProduct.family}
              disabled
            />
            <Input
              label="Subfamily"
              name="sub_family"
              value={currentProduct.sub_family}
              disabled
            />
            <Input
              label="Subject to Shelf Life"
              name="subject_to_shelf_life"
              value={currentProduct.subject_to_shelf_life}
              disabled
            />
            <Input
              name="order_quantity"
              label="Order quantity"
              type="number"
              value={currentProduct.order_quantity}
              onChange={handleInputChange}
            />
            <Input
              name="balance_due"
              label="Balance due"
              disabled
              value={currentProduct.balance_due}
              onChange={handleInputChange}
            />
            <Input
              name="price"
              label="Price"
              disabled
              value={currentProduct.price}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary fs-4" type="button" onClick={handleAddProduct}>
              Add product to sale
            </button>
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Family</th>
                  <th>Subfamily</th>
                  <th>Subject to Shelf Life</th>
                  <th>Order Quantity</th>
                  <th>Balance Due</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_name}</td>
                    <td>{product.sku}</td>
                    <td>{product.family}</td>
                    <td>{product.sub_family}</td>
                    <td>{product.subject_to_shelf_life}</td>
                    <td>{product.order_quantity}</td>
                    <td>{product.balance_due}</td>
                    <td>{product.price}</td>
                    <td>
                      <button type="button" onClick={() => handleEditProduct(index)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <div className="mt-4">
              <h4>Total Cost: CAD {salesOrderData.total_cost.toFixed(2)}</h4> {/* Display the total cost */}
            </div>
            </table>
            <hr className="hr my-4" />
            <h2 className="mt-4" style={{ fontWeight: "bold" }}>
              Shipment
            </h2>
            <Input
              register={register}
              name="order_date"
              label="Order date"
              type="date"
              defaultValue=""
            />
            <Dropdown
              label="Partial Shipment"
              name="partial_shipment"
              register={register}
              options={["", "Yes", "No"]}
            />
            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  name="ship_date_1"
                  label="Ship Date 1"
                  type="date"
                  defaultValue=""
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Count days to sched date 1"
                  disabled={true}
                  value={daysBetween(
                    salesOrderData.ship_date_1,
                    formatDate(new Date())
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  name="ship_date_2"
                  label="Ship Date 2"
                  type="date"
                  defaultValue=""
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Count days to sched date 2"
                  disabled={true}
                  value={daysBetween(
                    salesOrderData.ship_date_2,
                    formatDate(new Date())
                  )}
                />
              </div>
            </div>
            <Dropdown
              label="Operation Status"
              register={register}
              name="status"
              options={[
                "",
                "Work Order - Initial",
                "Purchasing",
                "Work Order - Secondary",
                "Incoming",
                "Quality",
                "Kitting",
                "Production",
                "Shipping",
              ]}
            />
            <Input
              register={register}
              name="date_of_ship"
              label="Date of shipment"
              type="date"
              defaultValue=""
            />
            <Input
              label="Lead Time (from order to shipping)"
              disabled={true}
              value={daysBetween(
                salesOrderData.date_of_ship,
                salesOrderData.order_date
              )}
            />
            <Dropdown
              label="Shipped on time?"
              name="was_ship_on_time"
              register={register}
              options={["", "Yes", "No"]}
            />
            <Dropdown
              label="Status of shipment"
              register={register}
              name="status_of_shipment"
              options={["", "Delayed", "On the way", "Delivered", "Not applicable"]}
            />
            <Input
              register={register}
              name="date_of_arrival"
              label="Date of arrival"
              type="date"
              defaultValue=""
            />
            <Input
              label="Transit time (from shipment to delivery)"
              disabled={true}
              value={daysBetween(
                salesOrderData.date_of_arrival,
                salesOrderData.date_of_ship
              )}
            />
            <Input
              label="Total time"
              disabled={true}
              value={daysBetween(
                salesOrderData.date_of_arrival,
                salesOrderData.order_date
              )}
            />
            <Input register={register} name="comments" label="Comments" />
            <div className="d-flex gap-3 flex-row-reverse my-4">
              <button
                className="btn btn-primary fs-4 10 w-100"
                type="submit"
                style={{ maxWidth: "200px" }}
              >
                {updateLoading ? "Processing..." : "Save"}
              </button>
              <button
                className="btn btn-outline-primary fs-4 10 w-100"
                style={{ maxWidth: "200px" }}
                type="button"
                onClick={() => reset()}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label className="product-label">Product name</label>
            <input
              className="product-input"
              type="text"
              name="product_name"
              value={currentProduct.product_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="product-label">Order quantity</label>
            <input
              className="product-input"
              type="number"
              name="order_quantity"
              value={currentProduct.order_quantity}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label className="product-label">Balance due</label>
            <input
              className="product-input"
              type="text"
              name="balance_due"
              value={currentProduct.balance_due}
              disabled
            />
          </div>
          <div className="form-group">
            <label className="product-label">Price</label>
            <input
              className="product-input"
              type="text"
              name="price"
              value={currentProduct.price}
              disabled
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SalesOrderDetails;
