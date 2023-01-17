import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

export interface User {
  id: number,
  name: string,
  sex: string,
}

export interface Product {
  id: number,
  name: string,
  categoryId: number,
}

export interface Category {
  id: number,
  title: string,
  icon: string,
  ownerId: number,
}

const users: User[] = usersFromServer;
const products: Product[] = productsFromServer;
const categories: Category[] = categoriesFromServer;

export const App: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');

  const data = products
    .filter(product => {
      if (selectedUserId === null && searchValue === '') {
        return true;
      }

      const category = categories.find(c => c.id === product.categoryId);

      return (
        (selectedUserId === null || category?.ownerId === selectedUserId)
        && product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    })
    .map(product => {
      const category = categories.find(c => c.id === product.categoryId);
      const owner = users.find(u => u.id === category?.ownerId);

      return {
        id: product.id,
        name: product.name,
        category: `${category?.icon} - ${category?.title}`,
        owner: {
          name: owner?.name,
          color: owner?.sex === 'm' ? 'has-text-link' : 'has-text-danger',
        },
      };
    });

  const handleUserClick = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleAllClick = () => {
    setSelectedUserId(null);
  };

  const handleClearClick = () => {
    setSearchValue('');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>
        <div className="renderedTable">
        </div>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUserId === null ? 'is-active' : ''}
                onClick={handleAllClick}
              >
                All
              </a>

              {users.map(user => (
                <a
                  data-cy="FilterUser"
                  key={user.id}
                  href="#/"
                  className={user.id === selectedUserId ? 'is-active' : ''}
                  onClick={() => handleUserClick(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {searchValue !== '' && (
                    // eslint-disable-next-line jsx-a11y/control-has-associated-label
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearClick}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td className={item.owner.color}>{item.owner.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
