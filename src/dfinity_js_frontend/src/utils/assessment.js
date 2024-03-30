import { transferICP } from "./ledger";

export async function getEnergyAssessments() {
  try {
    return await window.canister.assessment.getEnergyAssessments();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
export async function getBookings() {
  try {
    return await window.canister.assessment.getBookings();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getPendings() {
  try {
    return await window.canister.assessment.getPendings();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getReservationFee() {
  try {
    return await window.canister.assessment.getReservationFee();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function addEnergyAssessment(assessment) {
  const result = await window.canister.assessment.addEnergyAssessment(assessment);

  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }

  return result.Ok;
}

// correct this function
export async function makeReservation(id, noOfDays) {
  const assessmentCanister = window.canister.assessment;
  const orderResponse = await assessmentCanister.createReservationOrder(
    id,
    noOfDays
  );
  if (orderResponse.Err) {
    let error = Object.entries(orderResponse.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }
  const canisterAddress = await assessmentCanister.getCanisterAddress();
  const block = await transferICP(
    canisterAddress,
    orderResponse.Ok.amount,
    orderResponse.Ok.memo
  );
  const result = await assessmentCanister.completeReservation(
    id,
    noOfDays,
    block,
    orderResponse.Ok.memo
  );
  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }
  return result.Ok;
}

export async function endReservation(id) {
  const result = await window.canister.assessment.endReservation(id);
  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }

  return result.Ok;
}

export async function deleteEnergyAssessment(id) {
  const result = await window.canister.assessment.deleteEnergyAssessment(id);
  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }
  return result.Ok;
}
export async function getEnergyAssessment(id) {
  const result = await window.canister.assessment.getEnergyAssessment(id);
  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }
  return result.Ok;
}
