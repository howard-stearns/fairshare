// Unit tests for domain.js.
// All tests are run together with: jasmine
// after installing with: npm install --global jasmine

const {roundUpToNearest, roundDownToNearest, User, Group, Exchange} = require('../domain.js');
jasmine.getEnv().configure({random: false}); // Whether or not to randomize the order.

describe('FairShare', function () {

  describe('model', function () {

    describe('rounding', function () {
      describe('to whole number', function () {
	describe('up', function () {
	  it('does not round unit.', function () {
	    expect(roundUpToNearest(0)).toBe(0);
	    expect(roundUpToNearest(1)).toBe(1);
	    expect(roundUpToNearest(2)).toBe(2);
	  });
	  it('rounds up if any remainder.', function () {
	    expect(roundUpToNearest(0.1)).toBe(1);
	    expect(roundUpToNearest(1.2)).toBe(2);
	    expect(roundUpToNearest(2.3)).toBe(3);	     	    
	  });
	  it('rounds up at half.', function () {
	    expect(roundUpToNearest(0.5)).toBe(1);
	    expect(roundUpToNearest(1.5)).toBe(2);
	    expect(roundUpToNearest(2.5)).toBe(3);	    
	  });
	});
	describe('down', function () {
	  it('does not round unit.', function () {
	    expect(roundDownToNearest(0)).toBe(0);
	    expect(roundDownToNearest(1)).toBe(1);
	    expect(roundDownToNearest(2)).toBe(2);
	  });
	  it('rounds down if any remainder.', function () {
	    expect(roundDownToNearest(0.1)).toBe(0);
	    expect(roundDownToNearest(1.2)).toBe(1);
	    expect(roundDownToNearest(2.3)).toBe(2);	     	    
	  });
	  it('rounds down at half.', function () {
	    expect(roundDownToNearest(0.5)).toBe(0);
	    expect(roundDownToNearest(1.5)).toBe(1);
	    expect(roundDownToNearest(2.5)).toBe(2);	    
	  });
	});
      });
      describe('to tenths', function () {
	describe('up', function () {
	  it('does not round unit.', function () {
	    expect(roundUpToNearest(0, 10)).toBe(0);
	    expect(roundUpToNearest(1, 10)).toBe(1);
	    expect(roundUpToNearest(2, 10)).toBe(2);

	    expect(roundUpToNearest(0.1, 10)).toBe(0.1);
	    expect(roundUpToNearest(0.2, 10)).toBe(0.2);
	  });
	  it('rounds up if any remainder.', function () {
	    expect(roundUpToNearest(0.11, 10)).toBe(0.2);
	    expect(roundUpToNearest(1.22, 10)).toBe(1.3);
	    expect(roundUpToNearest(2.33, 10)).toBe(2.4);	     	    
	  });
	  it('rounds up at half.', function () {
	    expect(roundUpToNearest(0.05, 10)).toBe(0.1);
	    expect(roundUpToNearest(1.15, 10)).toBe(1.2);
	    expect(roundUpToNearest(2.25, 10)).toBe(2.3);	    
	  });
	});
	describe('down', function () {
	  it('does not round unit.', function () {
	    expect(roundDownToNearest(0, 10)).toBe(0);
	    expect(roundDownToNearest(1, 10)).toBe(1);
	    expect(roundDownToNearest(2, 10)).toBe(2);
	  });
	  it('rounds down if any remainder.', function () {
	    expect(roundDownToNearest(0.11, 10)).toBe(0.1);
	    expect(roundDownToNearest(1.22, 10)).toBe(1.2);
	    expect(roundDownToNearest(2.33, 10)).toBe(2.3);	     	    
	  });
	  it('rounds down at half.', function () {
	    expect(roundDownToNearest(0.05, 10)).toBe(0);
	    expect(roundDownToNearest(1.15, 10)).toBe(1.1);
	    expect(roundDownToNearest(2.25, 10)).toBe(2.2);	    
	  });
	});
      });
    });

    describe('User', function () {
      it('found by key.', function () {
	const u = User.create({key: 'a'});
	expect(User.get('a')).toBe(u);
      });
      it('missing key gets as falsy.', function () {
	expect(User.get('does-not-exist')).toBeFalsy();
      });
      it('key defaults to lowercase concatenate.', function () {
	const u1 = User.create({name: 'FooBarBaz'}); // Providing name but not key.
	const u2 = User.create({name: 'Singular'});
	const u3 = User.create({name: 'Inigo Montoya'});
	const u4 = User.create({name: 'Iñigo Martínez'});
	expect(User.get('foobarbaz')).toBe(u1);
	expect(User.get('FooBarBaz')).toBeFalsy();
	expect(User.get('singular')).toBe(u2);
	expect(User.get('inigomontoya')).toBe(u3);
	expect(User.get('iñigomartínez')).toBe(u4);
      });
      it('records name, img.', function () {
	const name = 'Alice Cooper',
	      img = 'fright',
	      u = User.create({name, img});
	expect(u.name).toBe(name);
	expect(u.img).toBe(img);
      });
    });

    describe('Group', function () {
      it('has different namespace from User.', function () {
	const key = 'similar',
	      u = User.create({key}),
	      g = Group.create({key});
	expect(User.get(key)).toBe(u);
	expect(Group.get(key)).toBe(g);
	expect(u).not.toBe(g);
      });

      describe('record', function () {
	it('includes name, img.', function () {
	  const name = 'Alice Cooper',
		img = 'fright',
		g = Group.create({name, img});
	  expect(g.name).toBe(name);
	  expect(g.img).toBe(img);
	});
	it('includes fee, stipend.', function () {
	  const name = 'Alice Cooper',
		fee = 8,
		stipend = 2,
		g = Group.create({name, fee, stipend});
	  expect(g.fee).toBe(fee);
	  expect(g.stipend).toBe(stipend);
	});
	it('includes people', function () {
	  const key = 'group',
		people = {a: {balance: 1}, b: {balance: 2}},
		g = Group.create({key, people});
	  expect(g.people.a.balance).toBe(1);
	  expect(g.people.b.balance).toBe(2);
	  expect(g.people.c).toBeUndefined();	
	});
      });

      describe('dry compution of costs', function () { // Each answers one cost for a specific operation, without error checking.
	it('computes transfer cost from fee without people.', function () {
	  const key = 'group',
		fee = 8,
		g = Group.create({key, fee}),
		amount = 10,
		beforeRounding = (1 + fee/100) * amount,
		afterRounding = roundUpToNearest(beforeRounding);
	  expect(g.computeTransferCost(amount)).toBe(afterRounding);
	});
	function checkPurchaseCost({fee, totalGroupCoinReserve, totalReserveCurrencyReserve, amount}) {
	  // Compute cost of purchasing group coin from reserve (using reserve currency) and confirm
	  // that before/after reserves are constant value before fee, and that
	  // computed cost matches is a rounded up version of constant-value-cost + fee.
	  const key = 'group',
		g = Group.create({key, fee, totalGroupCoinReserve, totalReserveCurrencyReserve}),
		cost = g.computePurchaseCost(amount);
	  // Uniswap V1 says that totalGroupCoinReserve * totalReserveCurrencyReserve is the same constant value
	  // before and after the exchange, not couting the fee and round-up.
	  // (The fee is then added to the reserve, increasong the value, and worsening the exchange rate for the next trade.)
	  const before = totalReserveCurrencyReserve * totalGroupCoinReserve, // The value that must be held constant.
		coinAfter = totalGroupCoinReserve - amount, // Group coin is taken from reserve, not minted.
		reserveAfter = before / coinAfter,          // Reserve must have this amount after to keep value constant.
		after = coinAfter * reserveAfter,
		buyerCost = reserveAfter - totalReserveCurrencyReserve,
		tax = amount * fee/100;
	  //console.log({before, coinAfter, reserveAfter, after, buyerCost, tax, cost});
	  expect(before).toBeCloseTo(after, 1e-7);
	  expect(cost).toBeGreaterThan(0);
	  expect(cost).toBe(roundUpToNearest(buyerCost + tax)); // Computed value should be theoretical cost+tax, rounded up.
	}
	it('computes purchase cost in FairShares from fee and reserves without people.', function () {
	  checkPurchaseCost({fee: 0.25, totalGroupCoinReserve: 500, totalReserveCurrencyReserve: 10, amount: 50});
	  checkPurchaseCost({fee: 1, totalGroupCoinReserve: 1000, totalReserveCurrencyReserve: 1000, amount: 10});
	});
	function checkCertificateCost({fee, totalGroupCoinReserve, totalReserveCurrencyReserve, amount}) {
	  // Same as checkPurchaseCost, above, but for the case of generating a FairShare certificate from reserve using the group coin.
	  const key = 'group',
		g = Group.create({key, fee, totalGroupCoinReserve, totalReserveCurrencyReserve}),
		cost = g.computeCertificateCost(amount);
	  const before = totalReserveCurrencyReserve * totalGroupCoinReserve,
		reserveAfter = totalReserveCurrencyReserve - amount,
		coinAfter = before / reserveAfter,
		after = coinAfter * reserveAfter,
		buyerCost = coinAfter - totalGroupCoinReserve,
		tax = amount * fee/100;
	  //console.log({before, coinAfter, reserveAfter, after, buyerCost, tax, cost});
	  expect(before).toBeCloseTo(after, 1e-7);
	  expect(cost).toBeGreaterThan(0);
	  expect(cost).toBe(roundUpToNearest(buyerCost + tax));
	}
	it('computes certificate cost in group coin from fee and reserves without people.', function () {
	  checkCertificateCost({fee: 0.25, totalGroupCoinReserve: 500, totalReserveCurrencyReserve: 10, amount: 1});
	  checkCertificateCost({fee: 1, totalGroupCoinReserve: 1000, totalReserveCurrencyReserve: 1000, amount: 10});
	});
      });

      function checkError(label, actionThunk, errorPropertiesThunk, checkBalances) {
	describe(label, function () {
	  it('throws error.', function () {
	    expect(actionThunk).toThrowMatching(e => {
	      let errorProperties = errorPropertiesThunk();
	      return Object.keys(errorProperties).every(key => e[key] === errorProperties[key]);
	    });
	  });
	  checkBalances();
	});
      }
      describe('internal send', function () {

	function sendTest(execute) {
	  const name = 'Group',
		fee = 8,
		amount = 10,
		startA = 100,
		startB = 2;
	  const people = {a: {balance: startA}, b: {balance: startB}},
		g = Group.create({name, fee, people}),
		expectedCost = g.computeTransferCost(amount),
		{cost, balance} = g.send(amount, 'a', 'b', execute);
	  let balanceA = startA, balanceB = startB;
	  function checkBalances() {
	    it('does not effect either balance.', function () {
	      expect(g.people.b.balance).toBe(balanceB);
	      expect(g.people.a.balance).toBe(balanceA);
	    });
	  }
	  it('answers {cost, balance}.', function () {
	    expect(cost).toBe(expectedCost);
	    expect(balance).toBe(balanceA - cost);
	  });
	  if (execute) {
	    it('adds amount to receiver balance.', function () {
	      expect(g.people.b.balance).toBe(startB + amount);
	    });
	    it('subtracts cost from sender balance.', function () {
	      expect(g.people.a.balance).toBe(startA - cost);
	    });
	  } else { // dry run
	    checkBalances();
	  }
	  describe('error conditions', function () {
	    beforeAll(function () { balanceA = g.people.a.balance; balanceB = g.people.b.balance; });
	    afterAll(function () { balanceA = startA; balanceB = startB; });
	    checkError('if sender not in group', 
		       () => g.send(amount, 'missing', 'b', execute),
		       () => ({name: 'UnknownUser', user: 'missing', groupName: name}),
		       checkBalances);
	    checkError('if receiver not in group',
		       () => g.send(amount, 'a', 'missing', execute),
		       () => ({name: 'UnknownUser', user: 'missing', groupName: name}),
		       checkBalances);
	    checkError('if sender has insufficient balance',
		       () => g.send(startA, 'a', 'b', execute),
		       () => ({name: 'InsufficientFunds', balance: startA-(execute ? expectedCost : 0), cost: g.computeTransferCost(startA), groupName: name}),
		       checkBalances);
	  });
	}
	describe('dry run', function () {
	  sendTest(false);
	});
	describe('executing run', function () {
	  sendTest(true);
	});
      });
      describe('sending between groups', function () {
	describe('not FairShare', function () {
	  function sendTest(execute) {
	    const name1 = 'Group1',
		  name2 = 'Group2',
		  fee1 = 1,
		  fee2 = 2,
		  reserve = 10e3,
		  startingBalanceAlice = 100,
		  startingBalanceBob = 10,
		  targetAmount = 10;
	    //let g1, g2, computedRedemptionCost, computedCertificateCost, certificateCost, balance;
	    //beforeEach(function () {
	    const g1 = Group.create({name: name1, fee: fee1, people: {alice: {balance: startingBalanceAlice}}, totalReserveCurrencyReserve: reserve, totalGroupCoinReserve: reserve});
	    const g2 = Group.create({name: name2, fee: fee2, people: {bob: {balance: startingBalanceBob}}, totalReserveCurrencyReserve: reserve, totalGroupCoinReserve: reserve});
	    // Working backwards from targetAmount in g2:
	    const computedRedemptionCost = g2.computePurchaseCost(targetAmount); // How much FairShare will be needed in g2 to exchanges for targetAmount of g2 currency:
	    const costs = g1.issueFairShareCertificate(computedRedemptionCost, 'alice', 'bob', 'group2', execute);
	    const certificateCost = costs.cost;
	    const balance = costs.balance;
	    const computedCertificateCost = g1.computeCertificateCost(computedRedemptionCost); // What should that cert have cost us in g1.
	    //	    });
	    const receiver = User.get('bob'),
		  certificate = receiver._pendingCerts[receiver._pendingCerts.length - 1], // Reaching into internals. Not public.
		  credit = execute && g2.redeemFairShareCertificate(certificate);

	    let balanceAlice = startingBalanceAlice, balanceBob = startingBalanceBob, reserve1coin = reserve, reserve1fairshare = reserve;
	    function checkBalances() {
	      it('does not effect balances.', function () {
		expect(g1.exchange.totalGroupCoinReserve).toBe(reserve1coin);
		expect(g1.exchange.totalReserveCurrencyReserve).toBe(reserve1fairshare);
		expect(g1.people.alice.balance).toBe(balanceAlice);
		expect(g2.people.bob.balance).toBe(balanceBob);
	      });
	    }
	    //console.log({computedRedemptionCost, computedCertificateCost, certificateCost, balance,});
	    it('does not require receiver to be in sending group or sender to be in receiving group.', function () {
	      expect(g1.people.bob).toBeUndefined(); // In this case
	      expect(g2.people.alice).toBeUndefined();
	    });
	    it('answers cost and resulting balance.', function () {
	      expect(certificateCost).toBe(computedCertificateCost);
	      expect(balance).toBe(startingBalanceAlice - certificateCost);
	    });
	    if (execute) {
	      it('subtracts cost from sender.', function () {
		expect(g1.people.alice.balance).toBe(balance);
	      });
	      it('adds sending group coin to its reserve.', function () {
		expect(g1.exchange.totalGroupCoinReserve).toBe(reserve + computedCertificateCost);
	      });
	      it('subtracts FairShare from sending reserve.', function () {
		expect(g1.exchange.totalReserveCurrencyReserve).toBe(reserve - computedRedemptionCost);
	      });
	      describe('redemption', function () {
		it('generates certificate for requested amount.', function () {
		  const {payee, amount, currency} = certificate;
		  expect(amount).toBe(computedRedemptionCost);
		  expect(payee).toBe('bob');
		  expect(currency).toBe('group2');
		});
		it('adds credit to receiver when certificate is redeemed.', function () {
		  expect(credit).toBeLessThanOrEqual(targetAmount); // Equal in almost all cases.
		  expect(g2.people.bob.balance).toBe(startingBalanceBob + credit);
		});
		it('adds FairShare to receiving reserve.', function () {
		  expect(g2.exchange.totalReserveCurrencyReserve).toBe(reserve + certificate.amount);
		});
		it('subtracts receiving group coin from its reserve.', function () {
		  expect(g2.exchange.totalGroupCoinReserve).toBe(reserve - credit);
		});
	      });
	    } else {
	      checkBalances();
	    }
	    describe('error conditions', function () {
	      beforeAll(function () {
		balanceAlice = g1.people.alice.balance;
		balanceBob = g2.people.bob.balance;
		reserve1coin = g1.exchange.totalGroupCoinReserve;
		reserve1fairshare = g1.exchange.totalReserveCurrencyReserve;
	      });
	      afterAll(function () { balanceAlice = startingBalanceAlice, balanceBob = startingBalanceBob, reserve1coin = reserve, reserve1fairshare = reserve; });
	      checkError('if sender not in group', 
			 () => g1.issueFairShareCertificate(targetAmount, 'missing', 'bob', 'group2', execute),
			 () => ({name: 'UnknownUser', user: 'missing', groupName: name1}),
			 checkBalances);
	      checkError('if receiver not in group',
			 () => g2.issueFairShareCertificate(targetAmount, 'alice', 'missing', 'group2', execute),
			 () => ({name: 'UnknownUser', user: 'missing', groupName: 'any'}),
			 checkBalances);
	      checkError('if sender has insufficient balance',
			 () => g1.issueFairShareCertificate(startingBalanceAlice, 'alice', 'bob', 'group2', execute),
			 () => {
			   const cost = g1.computeCertificateCost(startingBalanceAlice),
				 balance = g1.people.alice.balance;
			   return {name: 'InsufficientFunds', balance, cost, groupName: name1};
			 },
			 checkBalances);
	      checkError('if certificate is reused',
			 () => g2.redeemFairShareCertificate(certificate),
			 () => (execute ? {name: 'ReusedCertificate', certificate} : {}),
			 checkBalances);
	    });
	  }
	  describe('dry run', function () {
	    sendTest(false);
	  });
	  describe('executing run', function () {
	    sendTest(true);
	  });
	});
      // describe('sending from FairShare group', function () { // Almost the same as between other groups, but sending group does not use exchange.
      // // 	const key1 = 'fairshare',
      // // 	      key2 = 'group2',
      // // 	      fee1 = 1,
      // // 	      fee2 = 2,
      // // 	      reserve = 10e3,
      // // 	      startingBalanceA = 100,
      // // 	      startingBalanceB = 10,
      // // 	      g1 = Group.create({key: key1, fee: fee1, people: {a: {balance: startingBalanceA}}, totalReserveCurrencyReserve: reserve, totalGroupCoinReserve: reserve}),
      // // 	      g2 = Group.create({key: key2, fee: fee2, people: {b: {balance: startingBalanceB}}, totalReserveCurrencyReserve: reserve, totalGroupCoinReserve: reserve}),
      // // 	      targetAmount = 10,
      // // 	      computedRedemptionCost = g2.computePurchaseCost(targetAmount),
      // // 	      computedCertificateCost = g1.computeTransferCost(computedRedemptionCost),
      // // 	      certificate = g1.issueFairShareCertificate(computedRedemptionCost, 'a', 'b'),
      // // 	      certificateCost = startingBalanceA - g1.people.a.balance,
      // // 	      credit = g2.redeemFairShareCertificate(certificate),
      // // 	      redemptionCredit = g2.people.b.balance - startingBalanceB;
      // // 	it('does not require receiver to be in sending group or sender to be in receiving group.', function () {
      // // 	  expect(g1.people.b).toBeUndefined(); // In this case
      // // 	  expect(g2.people.a).toBeUndefined();
      // // 	});
      // // 	it('generates certificate for requested amount.', function () {
      // // 	  expect(certificate.amount).toBe(computedRedemptionCost);
      // // 	});
      // // 	it('subtracts cost from sender.', function () {
      // // 	  expect(certificateCost).toBe(computedCertificateCost);
      // // 	});
      // // 	it('does not change sending group coin to its reserve.', function () {
      // // 	  expect(g1.exchange.totalGroupCoinReserve).toBe(reserve);
      // // 	});
      // // 	it('does not change FairShare in sending reserve.', function () {
      // // 	  expect(g1.exchange.totalReserveCurrencyReserve).toBe(reserve);
      // // 	});
      // // 	it('adds credit to receiver when certificate is redeemed.', function () {
      // // 	  expect(redemptionCredit).toBeLessThanOrEqual(targetAmount); // Equal in almost all cases.
      // // 	});
      // // 	it('adds FairShare to receiving reserve.', function () {
      // // 	  expect(g2.exchange.totalReserveCurrencyReserve).toBe(reserve + certificate.amount);
      // // 	});
      // // 	it('subtracts receiving group coin from its reserve.', function () {
      // // 	  expect(g2.exchange.totalGroupCoinReserve).toBe(reserve - redemptionCredit);
      // // 	});
      // // });
      // // describe('sending to FairShare group', function () { // Almost the same as between other groups, but receiving group does not use exchange.
      // // 	const key1 = 'group1',
      // // 	      key2 = 'fairshare',
      // // 	      fee1 = 1,
      // // 	      fee2 = 2,
      // // 	      reserve = 10e3,
      // // 	      startingBalanceA = 100,
      // // 	      startingBalanceB = 10,
      // // 	      g1 = Group.create({key: key1, fee: fee1, people: {a: {balance: startingBalanceA}}, totalReserveCurrencyReserve: reserve, totalGroupCoinReserve: reserve}),
      // // 	      g2 = Group.create({key: key2, fee: fee2, people: {b: {balance: startingBalanceB}}, totalReserveCurrencyReserve: reserve, totalGroupCoinReserve: reserve}),
      // // 	      targetAmount = 10,
      // // 	      computedRedemptionCost = g2.computeTransferCost(targetAmount), // Different from computePurchaseCost used for receiving to other groups.
      // // 	      computedCertificateCost = g1.computeCertificateCost(computedRedemptionCost),
      // // 	      certificate = g1.issueFairShareCertificate(computedRedemptionCost, 'a', 'b'),
      // // 	      certificateCost = startingBalanceA - g1.people.a.balance,
      // // 	      credit = g2.redeemFairShareCertificate(certificate),
      // // 	      redemptionCredit = g2.people.b.balance - startingBalanceB;
      // // 	//console.log({computedRedemptionCost, computedCertificateCost, certificate, certificateCost, credit, redemptionCredit});
      // // 	it('does not require receiver to be in sending group or sender to be in receiving group.', function () {
      // // 	  expect(g1.people.b).toBeUndefined(); // In this case
      // // 	  expect(g2.people.a).toBeUndefined();
      // // 	});
      // // 	it('generates certificate for requested amount.', function () {
      // // 	  expect(certificate.amount).toBe(computedRedemptionCost);
      // // 	});
      // // 	it('subtracts cost from sender.', function () {
      // // 	  expect(certificateCost).toBe(computedCertificateCost);
      // // 	});
      // // 	it('adds sending group coin to its reserve.', function () {
      // // 	  expect(g1.exchange.totalGroupCoinReserve).toBe(reserve + computedCertificateCost);
      // // 	});
      // // 	it('subtracts FairShare from sending reserve.', function () {
      // // 	  expect(g1.exchange.totalReserveCurrencyReserve).toBe(reserve - certificate.amount);
      // // 	});
      // // 	it('adds credit to receiver when certificate is redeemed.', function () {
      // // 	  expect(redemptionCredit).toBeLessThanOrEqual(targetAmount);
      // // 	});
      // // 	it('does not change receiving group reserve currency.', function () {
      // // 	  expect(g2.exchange.totalReserveCurrencyReserve).toBe(reserve); // Unchanged, unlike receiving to other groups.
      // // 	});
      // // 	it('does not change receiving group coin in its reserve.', function () {
      // // 	  expect(g2.exchange.totalGroupCoinReserve).toBe(reserve); // Unchanged, unlike receiving to other groups.
      // // 	});
      // // });
      // // FIXME: In real app, the sender cannot redeem cert for the recipient (e.g., if sender is not a member). So we must instead add cert to recipient's pending stuff.
      // 	     // FIXME: test against double redeem
      // 	     // FIXME: test for exceeding reserve (at either end) and for exceeding user's balance.
      // 	// FIXME: test for recipient not being a member of receiving group.
      });
    });

    describe('internal', function () { // Not part of the API used by the app.
      describe('Exchange', function () {
	function testGroupCoinTrades({totalReserveCurrencyReserve = 100, totalGroupCoinReserve = 100, fee=0, nCycles=10,
				      allowedDrift = 1, label = `of group coin with fee=${fee}, coinReserve=${totalGroupCoinReserve}`}) {
	  it(label, function () {
	    let exchange = new Exchange({totalReserveCurrencyReserve, totalGroupCoinReserve, fee});
	    for (let i=0; i<nCycles; i++) {
	      exchange.buyGroupCoin(1);
	      exchange.sellGroupCoin(1);
	    }
	    let kBefore = totalReserveCurrencyReserve * totalGroupCoinReserve,
		rounding = Math.max(nCycles, nCycles * fee),
		kAfter = (exchange.totalReserveCurrencyReserve - rounding) * exchange.totalGroupCoinReserve;
	    //console.log({kBefore, kAfter, reserve: exchange.totalReserveCurrencyReserve, rounding, coin: exchange.totalGroupCoinReserve});
	    expect(kBefore).toBeCloseTo(kAfter, allowedDrift);
	  });
	}
	function testReserveCurrencyTrades({totalReserveCurrencyReserve = 100, totalGroupCoinReserve = 100, fee=0, nCycles=10,
					    allowedDrift = 1, label = `of reserve currency with fee=${fee}, coinReserve=${totalGroupCoinReserve}`}) {
	  it(label, function () {
	    let exchange = new Exchange({totalReserveCurrencyReserve, totalGroupCoinReserve, fee});
	    for (let i=0; i<nCycles; i++) {
	      exchange.buyReserveCurrency(1);
	      exchange.sellReserveCurrency(1);
	    }
	    let kBefore = totalReserveCurrencyReserve * totalGroupCoinReserve,
		rounding = Math.max(nCycles, nCycles * fee), // Not always correct! If reserve is two orders of magnitude more than coin, it can be twice that.
		kAfter = exchange.totalReserveCurrencyReserve * (exchange.totalGroupCoinReserve - rounding);
	    //console.log({kBefore, kAfter, nCycles, fee, reserve: exchange.totalReserveCurrencyReserve, rounding, coin: exchange.totalGroupCoinReserve});
	    expect(kBefore).toBeCloseTo(kAfter, allowedDrift);
	  });
	}

	testGroupCoinTrades({});
	testGroupCoinTrades({totalGroupCoinReserve: 10000});
	testGroupCoinTrades({fee: 0.003});
	testGroupCoinTrades({totalGroupCoinReserve: 10000, fee: 0.003});

	testReserveCurrencyTrades({});
	testReserveCurrencyTrades({totalGroupCoinReserve: 10000});
	testReserveCurrencyTrades({fee: 0.003});
	testReserveCurrencyTrades({totalGroupCoinReserve: 1000, fee: 0.003});
      });
    });
  });
});