export const APIDoc = {
  auth: {
    forgotPassword: {
      apiOperation: 'Send reset password link to email',
      apiOk: 'Reset password link sent success',
    },
    resetPassword: {
      apiOperation: 'Reset password',
      apiOk: 'Reset password successfully',
      apiBadRequest: 'Token is expired',
    },
    loginGoogle: {
      apiOperation: 'Login with google token',
      apiOk: 'Token for access system',
    },
    register: {
      apiOperation: 'Register user with email',
      apiOk: 'Token for access system',
    },
    login: {
      apiOperation: 'Login with email & password',
      apiOk: 'Token for access system',
    },
    refresh: {
      apiOperation: 'Refresh access token',
      apiOk: 'Token for access system',
    },
    logout: {
      apiOperation: 'Logout system',
      apiOk: 'Logout successfully',
    },
  },
  permission: {
    create: {
      apiOperation: 'Create new permission',
      apiOk: 'New permission entity',
    },
    read: {
      apiOperation: 'Get list permissions',
      apiOk: 'List permissions',
    },
    detail: {
      apiOperation: 'Get permission detail by id',
      apiOk: 'Permission detail',
    },
    update: {
      apiOperation: 'Update permission',
      apiOk: 'Permission detail',
    },
    delete: {
      apiOperation: 'Delete permission by id',
      apiOk: 'Success operation',
    },
  },
  role: {
    create: {
      apiOperation: 'Create new role',
      apiOk: 'New role entity',
    },
    read: {
      apiOperation: 'Get list roles',
      apiOk: 'List roles',
    },
    detail: {
      apiOperation: 'Get role detail by id',
      apiOk: 'Role detail',
    },
    update: {
      apiOperation: 'Update role',
      apiOk: 'Role detail',
    },
    delete: {
      apiOperation: 'Delete role by id',
      apiOk: 'Success operation',
    },
  },
  category: {
    create: {
      apiOperation: 'Create new category',
      apiOk: 'New category entity',
    },
    read: {
      apiOperation: 'Get list categories',
      apiOk: 'List categories',
    },
    detail: {
      apiOperation: 'Get category detail by id',
      apiOk: 'Category detail',
    },
    update: {
      apiOperation: 'Update category',
      apiOk: 'Category detail',
    },
    delete: {
      apiOperation: 'Delete category by id',
      apiOk: 'Success operation',
    },
  },
  comment: {
    create: {
      apiOperation: 'Create new comment',
      apiOk: 'New comment entity',
    },
    read: {
      apiOperation: 'Get list comments',
      apiOk: 'List comments',
    },
    detail: {
      apiOperation: 'Get comment detail by id',
      apiOk: 'Comment detail',
    },
    update: {
      apiOperation: 'Update comment',
      apiOk: 'Comment detail',
    },
    delete: {
      apiOperation: 'Delete comment by id',
      apiOk: 'Success operation',
    },
  },
  contact: {
    create: {
      apiOperation: 'Create new contact',
      apiOk: 'New contact entity',
    },
    read: {
      apiOperation: 'Get list contacts',
      apiOk: 'List contacts',
    },
    readThemselves: {
      apiOperation: 'Get list contacts belong to themselves',
      apiOk: 'List contacts belong to themselves',
    },
    detail: {
      apiOperation: 'Get contact detail by id',
      apiOk: 'Contact detail',
    },
    detailThemselves: {
      apiOperation: 'Get contact detail by id belong to themselves',
      apiOk: 'Contact detail belong to themselves',
    },
    update: {
      apiOperation: 'Update contact',
      apiOk: 'Contact detail',
    },
    delete: {
      apiOperation: 'Delete contact by id',
      apiOk: 'Success operation',
    },
  },
  image: {
    create: {
      apiOperation: 'Create new image',
      apiOk: 'New image entity',
    },
    read: {
      apiOperation: 'Get list images',
      apiOk: 'List images',
    },
    detail: {
      apiOperation: 'Get image detail by id',
      apiOk: 'Image detail',
    },
    update: {
      apiOperation: 'Update image',
      apiOk: 'Image detail',
    },
    delete: {
      apiOperation: 'Delete image by id',
      apiOk: 'Success operation',
    },
  },
  product: {
    create: {
      apiOperation: 'Create new product',
      apiOk: 'New product entity',
    },
    read: {
      apiOperation: 'Get list products',
      apiOk: 'List products',
    },
    detail: {
      apiOperation: 'Get product detail by id',
      apiOk: 'Product detail',
    },
    update: {
      apiOperation: 'Update product',
      apiOk: 'Product detail',
    },
    delete: {
      apiOperation: 'Delete product by id',
      apiOk: 'Success operation',
    },
  },
  profile: {
    detail: {
      apiOperation: 'Get profile detail belong to themselves',
      apiOk: 'Profile detail',
    },
    update: {
      apiOperation: 'Update profile',
      apiOk: 'Profile detail',
    },
    updatePassword: {
      apiOperation: 'Update password',
      apiOk: 'Profile detail',
    },
  },
  tag: {
    create: {
      apiOperation: 'Create new tag',
      apiOk: 'New tag entity',
    },
    read: {
      apiOperation: 'Get list tags',
      apiOk: 'List tags',
    },
    detail: {
      apiOperation: 'Get tag detail by id',
      apiOk: 'Tag detail',
    },
    update: {
      apiOperation: 'Update tag',
      apiOk: 'Tag detail',
    },
    delete: {
      apiOperation: 'Delete tag by id',
      apiOk: 'Success operation',
    },
  },
  user: {
    create: {
      apiOperation: 'Create new user',
      apiOk: 'New user entity',
    },
    read: {
      apiOperation: 'Get list users',
      apiOk: 'List users',
    },
    detail: {
      apiOperation: 'Get user detail by id',
      apiOk: 'User detail',
    },
    update: {
      apiOperation: 'Update user',
      apiOk: 'User detail',
    },
    updatePassword: {
      apiOperation: 'Update password user',
      apiOk: 'User detail',
    },
    sendVerify: {
      apiOperation: 'Send verify link for user by id',
      apiOk: 'User detail',
    },
    delete: {
      apiOperation: 'Delete user by id',
      apiOk: 'Success operation',
    },
  },
}
