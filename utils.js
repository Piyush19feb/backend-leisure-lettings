function createErrorResult(error) {
  return { status: "error", error: error };
  // return { status: "error", error};  // since we have same key and value and hence no need to give it explicitly
}

function createSuccessResult(data) {
  return { status: "success", data: data };
  // return { status: "success", data};
}

function createResult(error, data) {
  if (error) {
    return createErrorResult(error);
  } else {
    return createSuccessResult(data);
  }
}

module.exports = {
  createErrorResult,
  createSuccessResult,
  createResult,
};
