import { Fragment, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [currOpen, setCurrOpen] = useState(null);
  const [friends, setFriends] = useState(initialFriends);
  const isBillFormOpen = currOpen !== null;
  const [isFriendFormOpened, setIsFriendFormOpened] = useState(false);
  const openedFriend = isBillFormOpen
    ? friends.filter((friend) => friend.id === currOpen)
    : [];
  function handleToggleBillForm(id) {
    if (currOpen === id) setCurrOpen(null);
    else setCurrOpen(id);
  }
  function setBalance(e, myExpense, friendExpense, payer) {
    e.preventDefault();
    if (!myExpense || !friendExpense) return;
    const paidAmount = payer === "You" ? friendExpense : -1 * myExpense;
    const updated = friends.map((friend) => {
      if (friend.id === currOpen) {
        const newBalance = friend.balance + paidAmount;
        return { ...friend, balance: newBalance };
      }
      return friend;
    });

    setFriends(updated);
    setCurrOpen(null);
  }
  function handleFriendForm(e, friendName, image) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name: friendName,
      image: `${image}?${id}`,
      balance: 0,
    };
    const updatedFriendsList = [...friends, newFriend];
    setFriends(updatedFriendsList);
    setIsFriendFormOpened(false);
  }
  function handleToggleFriendForm() {
    setIsFriendFormOpened((isFriendFormOpened) => !isFriendFormOpened);
  }
  return (
    <div className="app">
      <SideBar
        currOpen={currOpen}
        handleToggleBillForm={handleToggleBillForm}
        friends={friends}
        handleFriendForm={handleFriendForm}
        isFriendFormOpened={isFriendFormOpened}
        handleToggleFriendForm={handleToggleFriendForm}
      />
      {isBillFormOpen && (
        <BillSplitter
          setBalance={setBalance}
          friendName={openedFriend[0].name}
        />
      )}
    </div>
  );
}

function SideBar({
  handleFriendForm,
  friends,
  handleToggleBillForm,
  currOpen,
  isFriendFormOpened,
  handleToggleFriendForm,
}) {
  return (
    <div className="sidebar">
      <ul>
        {friends.map((friend) => (
          <FriendItem
            handleToggleBillForm={handleToggleBillForm}
            friend={friend}
            currOpen={currOpen}
          />
        ))}
      </ul>
      {isFriendFormOpened && (
        <FriendAdder handleFriendForm={handleFriendForm} />
      )}
      <Button handler={handleToggleFriendForm}>
        {isFriendFormOpened ? "close" : "Add Friend"}
      </Button>
    </div>
  );
}

function Button({ handler, children }) {
  return (
    <button className="button" onClick={handler}>
      {children}
    </button>
  );
}

function FriendAdder({ handleFriendForm }) {
  const [friendName, setFriendName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/300");
  function handleFriendName(e) {
    const value = e.target.value;
    setFriendName(value);
  }
  function handleImage(e) {
    const value = e.target.value;
    setImage(value);
  }
  return (
    <form
      className="form-add-friend"
      onSubmit={(e) => handleFriendForm(e, friendName, image)}
    >
      <Input
        label="👬 Friend Name"
        type={"text"}
        link="friendName"
        value={friendName}
        handler={handleFriendName}
      />

      <Input
        label="📷 Image URL"
        type={"text"}
        link="image"
        value={image}
        handler={handleImage}
      />
      <Button>Add</Button>
    </form>
  );
}

function Input({ label, link, type, value, handler, disabled, min }) {
  return (
    <Fragment>
      <label htmlFor={link}>{label}</label>
      <input
        type={type}
        id={link}
        value={value}
        onChange={handler}
        disabled={disabled}
        min={min}
      />
    </Fragment>
  );
}

function FriendItem({ friend, handleToggleBillForm, currOpen }) {
  return (
    <li
      onClick={() => handleToggleBillForm(friend.id)}
      className={friend.id === currOpen ? "selected" : ""}
      key={friend.id}
    >
      <img src={friend.image} alt={` ${friend.name}`} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {-1 * friend.balance}&euro;
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}&euro;
        </p>
      )}
      <Button handler={() => handleToggleBillForm(friend.id)}>
        {currOpen === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function BillSplitter({ friendName, setBalance }) {
  const [billAmount, setBillAmount] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [payer, setPayer] = useState("You");
  const friendExpense = billAmount - myExpense;
  function handleBillValue(e) {
    const value = e.target.value;

    if (value.startsWith("0") && value.length > 1) {
      setBillAmount(value.slice(1));
      return;
    }

    const numberValue = Number(value);

    if (numberValue < 0) {
      alert("Bill Value Cannot Be Negative");
      setBillAmount("");
    } else {
      setBillAmount(value);
    }
  }

  function handleMyExpense(e) {
    const value = e.target.value;
    if (value.startsWith("0") && value.length > 1) {
      setMyExpense(value.slice(1));
      return;
    }
    const numberValue = Number(value);
    if (numberValue > billAmount) {
      setMyExpense("");
      alert("Your Expense should not be above the bill value");
    } else if (numberValue < 0) {
      alert("Your Expense Can Not Be Negative");
      setMyExpense("");
    } else setMyExpense(numberValue);
  }
  function handleBillPayer(e) {
    const value = e.target.value;
    setPayer(value);
  }

  return (
    <form
      className="form-split-bill"
      onSubmit={(e) => setBalance(e, myExpense, friendExpense, payer)}
    >
      <h2>Split A Bill With {friendName}</h2>

      <Input
        label={`💰 Bill Value`}
        type="number"
        link="bill"
        min={0}
        value={billAmount}
        disabled={false}
        handler={handleBillValue}
      />
      <Input
        label={`🤵 Your Expense`}
        type="number"
        link="myExpense"
        min={0}
        value={myExpense}
        handler={handleMyExpense}
        disabled={false}
      />
      <Input
        label={`👬 ${friendName}'s Expense`}
        type="number"
        link="friendExpense"
        value={friendExpense ? friendExpense : ""}
        disabled={true}
      />
      <label>🤑 Who's paying the bill?</label>
      <select value={payer} onChange={handleBillPayer}>
        <option value="You">You</option>
        <option value={friendName}>{friendName}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
