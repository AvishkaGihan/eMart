import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../slices/orderApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();

  //   toast.success('Order is paid');
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h1 className="mb-4" style={{ fontWeight: 850, letterSpacing: "-0.03em" }}>
        Order <span className="text-muted" style={{ fontFamily: "var(--bs-font-monospace)", fontSize: "1.5rem", fontWeight: 500 }}>#{order._id}</span>
      </h1>
      <Row className="gy-4">
        <Col md={8}>
          <div className="order-details-card">
            <h2>Shipping</h2>
            <p>
              <strong>Name: </strong> {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>{" "}
              <a href={`mailto:${order.user.email}`} style={{ color: "#7B2CBF", textDecoration: "none" }}>{order.user.email}</a>
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="order-status-banner success">
                Delivered on {order.deliveredAt.substring(0, 10)} at {order.deliveredAt.substring(11, 16)}
              </div>
            ) : (
              <div className="order-status-banner danger">Not Delivered</div>
            )}
          </div>

          <div className="order-details-card">
            <h2>Payment Method</h2>
            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="order-status-banner success">
                Paid on {order.paidAt.substring(0, 10)} at {order.paidAt.substring(11, 16)}
              </div>
            ) : (
              <div className="order-status-banner danger">Not Paid</div>
            )}
          </div>

          <div className="order-details-card">
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <div className="order-status-banner info">Order is empty</div>
            ) : (
              <div className="order-items-list">
                {order.orderItems.map((item, index) => (
                  <div className="order-item-row" key={index}>
                    <div className="order-item-image-wrapper">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="order-item-details">
                      <Link to={`/product/${item.product}`} className="order-item-name">
                        {item.name}
                      </Link>
                    </div>
                    <div className="order-item-price-calc">
                      {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
        <Col md={4}>
          <div className="order-summary-card">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>${order.itemsPrice}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>${order.shippingPrice}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>${order.taxPrice}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>
            {!order.isPaid && (
              <div className="paypal-section mt-4">
                {loadingPay && <Loader />}

                {isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  ></PayPalButtons>
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}

            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button
                  type="button"
                  className="premium-add-to-cart w-100 mt-4"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
