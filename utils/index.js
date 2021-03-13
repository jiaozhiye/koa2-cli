// 递归生成菜单树
exports.createMenuTree = (arr) => {
  let _root_ = { id: '0' };

  (function fn(target) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].pid == target.id) {
        // 递归调用
        fn(arr[i]);
        // =======
        !Array.isArray(target.children) && (target.children = []);
        target.children.push(arr[i]);
        arr.splice(i--, 1);
      }
    }
  })(_root_);

  return _root_.children;
};
